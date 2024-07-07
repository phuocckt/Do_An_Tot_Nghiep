import { useEffect, useState } from "react";
import "./css/ProductDetail.css";
import { FaChevronDown, FaChevronUp, FaRegHeart, FaHeart } from "react-icons/fa";
import { addWishlist, getProduct, getProducts } from '../features/product/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from "react-router-dom";
import { addToCart } from '../features/auth/authSlice';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { useFormik } from "formik";
import Comment from '../components/Comment/Comment';
import { CurrencyFormatter } from "../components/CurrencyFormatter";
import { getUser } from "../features/customer/customerSlice";

function ProductDetail() {
  const [active, setActive] = useState(false);
  const [activeFavorite, setActiveFavorite] = useState(false);
  const [urlImage, setUlrImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);  // State to track selected size
  const { id } = useParams();
  const user = useSelector(state => state.auth.user);
  const user2 = useSelector(state => state.customer.customer);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getProduct(id));
    dispatch(getUser(user._id));
    setSelectedSize(null);
  }, [dispatch, id, user._id]);

  useEffect(() => {
    if (user2.wishlist) {
      user2.wishlist.forEach(item => {
        if (item._id === id) {
          setActiveFavorite(true);
        }
      });
    }
  }, [user2.wishlist, id]);

  const productState = useSelector((state) => state.product.product);
  const productsState = useSelector((state) => state.product.products);

  const [value, setValue] = useState(1);

  const increment = () => {
    setValue(prevValue => (prevValue < productState.quantity ? prevValue + 1 : productState.quantity));
  };

  const decrement = () => {
    setValue(prevValue => (prevValue > 1 ? prevValue - 1 : 1));
  };

  const formikFavorite = useFormik({
    initialValues: {
      prodId: ''
    },
    onSubmit: values => {
      dispatch(addWishlist(values));
    },
  });

  const handleFavoriteClick = () => {
    formikFavorite.setFieldValue('prodId', productState._id);
    setActiveFavorite(!activeFavorite);
  };

  const schema = yup.object().shape({
    size: yup.string().required('Size is required'),
    count: yup.number().required('Count is required').min(1, 'Count must be at least 1')
  });

  const formik = useFormik({
    initialValues: {
      _id: id,
      count: value,
      size: '',
      price: productState?.price || 0  // Default to 0 if price is not available
    },
    validationSchema: schema, 
    onSubmit: values => {
      values.size = selectedSize;  // Set the selected size before submitting
      values.price = productState?.price;  // Ensure price is included in the form data
      const cartData = {
        cart: [
          {
            _id: id,
            count: values.count,
            size: values.size,
            price: values.price
          }
        ]
      };
      dispatch(addToCart(cartData))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Sản phẩm đã thêm!",
            html: `
              <p>Sản phẩm ${productState.title} đã được thêm vào giỏ hàng</p>
              <a class="btn btn-success" href="/cart">Xem giỏ hàng</a>
            `,
            icon: "success",
            showCancelButton: false,
            showConfirmButton: false
          });
        })
        .catch(() => {
          Swal.fire({
            title: "Vui lòng đăng nhập",
            html: `
              <a class="btn btn-warning" href="/login">Đăng nhập</a>
            `,
            icon: "error",
            showCancelButton: false,
            showConfirmButton: false
          });
        });
    },
    enableReinitialize: true  // This will reinitialize formik state when productState changes
  });

  const handleChange = (item) => () => {
    setUlrImage(item.url);
  }

  const handleSizeClick = (size) => {
    setSelectedSize(size);  // Set the selected size
    formik.setFieldValue('size', size);  // Update formik state
  }

  const handleClick = () => {
    setActive(!active);
    setUlrImage(null);
  }

  // Render loading state while productState is being fetched
  if (!productState) {
    return <div>Đang tải...</div>;
  }

  return (
    <>
      <div className="product-detail">
        <div className="product-images">
          <div className="images">
            {productState.image?.map(item => (
              <img key={item.url} onClick={handleChange(item)} className='product-img' src={item.url} alt="Ảnh sản phẩm" />
            ))}
          </div>
          <div className="main-image">
            <img className='product-img' src={urlImage || productState.image?.[0].url} alt="Ảnh sản phẩm" />
          </div>
        </div>

        <div className="image-carousel">
          {productState.image?.map(item => (
            <img key={item.url} onClick={handleChange(item)} className='product-img' src={item.url} alt="Ảnh sản phẩm" />
          ))}
        </div>

        <div className="product-info">
          <div className="product-content">
            <h2 className="pb-3">{productState.title}</h2>
            <p name="price">Giá: <CurrencyFormatter className="fw-bold text-danger" amount={productState.price}/></p>
            <p className="mt-3">Màu sắc:</p>
            <div className="product-color">
              {productsState
                .filter(item => item.title === productState.title)
                .map(item => (
                  <Link key={item._id} to={`/product/${item._id}`}>
                    <img onClick={handleClick} className='product-img' src={item.image?.[0].url} alt="Ảnh sản phẩm" />
                  </Link>
                ))
              }
            </div>
            <div className="product-action">
              <form onSubmit={formik.handleSubmit}>
                <div className="product-size m-0">
                  <p>Kích thước:</p>
                  {productState.variants?.map(variant => (
                    <span 
                      key={variant.size._id} 
                      className={selectedSize === variant.size.title ? 'active-color' : ''} 
                      onClick={() => handleSizeClick(variant.size.title)}
                    >
                      {variant.size.title}
                    </span>
                  ))}
                </div>
                {formik.errors.size && <p style={{ color: "red", fontSize: "13px" }} className="error m-0">{formik.errors.size}</p>}
                <p>Số lượng:</p>
                <div className="input-number mb-4">
                  <div className="btn-decrement" onClick={decrement}>-</div>
                  <input
                    id="count"
                    name="count"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="number-input"
                    value={formik.values.count}
                    min="1"
                  />
                  <div className="btn-increment" onClick={increment}>+</div>
                  {formik.errors.count && formik.touched.count && <p style={{ color: "red", fontSize: "13px" }} className="error">{formik.errors.count}</p>}
                </div>
                <button type="submit">Thêm vào giỏ hàng</button>
              </form>
              <form onSubmit={formikFavorite.handleSubmit}>
                <input type="hidden" name="prodId" value={formikFavorite.values.prodId}/>
                {
                  user?._id ? (
                    <button type="submit" className={activeFavorite ? 'active-favorite' : 'favorite'} onClick={handleFavoriteClick}>
                      Yêu thích {activeFavorite ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                    </button>
                  ) : ("")
                }
              </form>
            </div>
            <p>{productState.description}</p>
          </div>
        </div>
      </div>
      <Comment product={productState}/>
    </>
  );
}

export default ProductDetail;
