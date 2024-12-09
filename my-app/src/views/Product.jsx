import { useEffect, useState } from "react";
import "../styles/productDetail.css";
import {
  FaChevronDown,
  FaChevronUp,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import {
  addWishlist,
  getProduct,
  getProducts,
} from "../features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { addToCart, getCart } from "../features/auth/authSlice";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import Comment from "../components/Comment/Comment";
import { CurrencyFormatter } from "../components/CurrencyFormatter";
import { getUser } from "../features/customer/customerSlice";
import { IoCart } from "react-icons/io5";

function ProductDetail(props) {
  const [active, setActive] = useState(false);
  const [activeSize, setActiveSize] = useState(false);
  const [activeFavorite, setActiveFavorite] = useState(false);
  const [urlImage, setUlrImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantitySize, setQuantitySize] = useState("");
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const user2 = useSelector((state) => state.customer.customer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getProduct(id));
    dispatch(getUser(user?._id));
    setSelectedSize(null);
  }, [dispatch, id, user?._id]);

  useEffect(() => {
    if (user2.wishlist) {
      user2.wishlist.forEach((item) => {
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
    setValue((prevValue) =>
      prevValue < quantitySize ? prevValue + 1 : quantitySize
    );
  };

  const decrement = () => {
    setValue((prevValue) => (prevValue > 1 ? prevValue - 1 : 1));
  };

  const formikFavorite = useFormik({
    initialValues: {
      prodId: "",
    },
    onSubmit: (values) => {
      dispatch(addWishlist(values));
    },
  });

  const handleFavoriteClick = () => {
    formikFavorite.setFieldValue("prodId", productState._id);
    setActiveFavorite(!activeFavorite);
  };

  const schema = yup.object().shape({
    size: yup.string().required("Vui lòng chọn kích thước"),
    count: yup
      .number()
      .required("Vui lòng chọn số lượng")
      .min(1, "Số lượng phải lớn hơn 1"),
  });

  const formik = useFormik({
    initialValues: {
      _id: id,
      count: value,
      size: selectedSize || "",
      price: productState?.price || 0,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      values.size = selectedSize;
      values.price = productState?.price;
      const cartData = {
        cart: [
          {
            _id: id,
            count: values?.count,
            size: values?.size,
            price: values?.price,
          },
        ],
      };
      dispatch(addToCart(cartData))
        .then(() => {
          Swal.fire({
            title: "Sản phẩm đã thêm!",
            html: `
              <p>Sản phẩm ${productState?.title} đã được thêm vào giỏ hàng</p></br>
              <a class="btn btn-success" href="/cart">Xem giỏ hàng</a>
            `,
            icon: "success",
            showCancelButton: false,
            showConfirmButton: false,
          });
          dispatch(getCart());
        })
        .catch((error) => {
          console.error("Error adding product to cart:", error);
          Swal.fire({
            title: "Vui lòng đăng nhập",
            html: `
              <a class="btn btn-warning" href="/login">Đăng nhập</a>
            `,
            icon: "error",
            showCancelButton: false,
            showConfirmButton: false,
          });
        });
    },
    enableReinitialize: true, // This will reinitialize formik state when productState changes
  });

  const handleChange = (item) => () => {
    setUlrImage(item.url);
  };

  const handleSizeClick = (size, quantity) => {
    setSelectedSize(size); // Set the selected size
    setQuantitySize(quantity);
    setActiveSize(true);
    setValue(1);
    formik.setFieldValue("size", size); // Update formik state
  };

  const handleClick = () => {
    setActive(!active);
    setUlrImage(null);
    setActiveSize(false);
  };

  // Render loading state while productState is being fetched
  if (!productState) {
    return <div>Đang tải...</div>;
  }

  return (
    <>
      <div className="product-detail">
        <div className="product-images">
          <div className="images">
            {productState.image?.map((item) => (
              <img
                key={item.url}
                onClick={handleChange(item)}
                className="product-img"
                src={item.url}
                alt="Ảnh sản phẩm"
              />
            ))}
          </div>
          <div className="main-image">
            <img
              className="product-img"
              src={urlImage || productState.image?.[0].url}
              alt="Ảnh sản phẩm"
            />
          </div>
        </div>

        <div className="image-carousel">
          {productState.image?.map((item) => (
            <img
              key={item.url}
              onClick={handleChange(item)}
              className="product-img"
              src={item.url}
              alt="Ảnh sản phẩm"
            />
          ))}
        </div>

        <div className="product-info">
          <div className="product-content">
            <h2 className="pb-3">{productState.title}</h2>
            <p name="price">
              {" "}
              <CurrencyFormatter
                className="fw-bold fs-4"
                amount={productState.price}
              />
            </p>
            {/* <p className="mt-3">Màu sắc:</p> */}
            <div className="product-color mt-3">
              {productsState
                ?.filter((item) => item?.title === productState?.title)
                ?.filter((item) => item?._id !== id)
                .map((item) => (
                  <Link key={item._id} to={`/${productState.brand.title.toLowerCase()}/${item._id}`}>
                    <img
                      onClick={handleClick}
                      className="product-img"
                      src={item.image?.[0].url}
                      alt="Ảnh sản phẩm"
                    />
                  </Link>
                ))}
            </div>
            <div className="product-action">
              <form onSubmit={formik.handleSubmit}>
                <div className="product-size m-0">
                  <p>Kích thước</p>
                  {productState.variants?.map((variant) => (
                    <button
                      type="button"
                      key={variant.size._id}
                      className={
                        selectedSize === variant.size.title
                          ? "active-color size"
                          : "size"
                      }
                      onClick={() =>
                        handleSizeClick(variant.size.title, variant.quantity)
                      }
                      onChange={formik.handleChange}
                      value={formik.values.size}
                      disabled={variant.quantity == 0}
                    >
                      {variant.size.title}
                    </button>
                  ))}
                </div>
                {formik.errors.size && (
                  <p
                    style={{ color: "red", fontSize: "13px" }}
                    className="error m-0"
                  >
                    {formik.errors.size}
                  </p>
                )}
                {activeSize ? (
                  <>
                    <p>
                      Số lượng size {selectedSize}:{" "}
                      <span className="fw-bold">{quantitySize}</span>
                    </p>
                    <div className="input-number mb-4">
                      <div className="btn-decrement" onClick={decrement}>
                        -
                      </div>
                      <input
                        id="count"
                        name="count"
                        type="text"
                        onChange={formik.handleChange}
                        className="number-input"
                        value={formik.values.count}
                        min="1"
                        readOnly
                      />
                      <div className="btn-increment" onClick={increment}>
                        +
                      </div>
                      {formik.errors.count && formik.touched.count && (
                        <p
                          style={{ color: "red", fontSize: "13px" }}
                          className="error"
                        >
                          {formik.errors.count}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="mb-4">
                    Số lượng tổng:{" "}
                    <span className="fw-bold">{productState.quantity}</span>
                  </p>
                )}
                {/* <div className="input-number mb-4">
                  <div className="btn-decrement" onClick={decrement}>
                    -
                  </div>
                  <input
                    id="count"
                    name="count"
                    type="text"
                    onChange={formik.handleChange}
                    className="number-input"
                    value={formik.values.count}
                    min="1"
                    readOnly
                  />
                  <div className="btn-increment" onClick={increment}>
                    +
                  </div>
                  {formik.errors.count && formik.touched.count && (
                    <p
                      style={{ color: "red", fontSize: "13px" }}
                      className="error"
                    >
                      {formik.errors.count}
                    </p>
                  )}
                </div> */}
                <button type="submit" className="btn btn-success"><IoCart className="fs-3" />Thêm vào giỏ hàng</button>
              </form>
              <form onSubmit={formikFavorite.handleSubmit}>
                <input
                  type="hidden"
                  name="prodId"
                  value={formikFavorite.values.prodId}
                />
                {user?._id ? (
                  <button
                    type="submit"
                    className={activeFavorite ? "active-favorite btn" : "favorite btn"}
                    onClick={handleFavoriteClick}
                  >
                    {activeFavorite ? (
                      <FaHeart className="text-danger" />
                    ) : (
                      <FaRegHeart />
                    )}
                    Yêu thích{" "}
                  </button>
                ) : (
                  ""
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="product-description">
        <div
          dangerouslySetInnerHTML={{ __html: productState.description }}
        />
      </div>
      <Comment product={productState} />
    </>
  );
}

export default ProductDetail;
