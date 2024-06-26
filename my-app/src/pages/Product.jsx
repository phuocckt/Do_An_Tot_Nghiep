import { useEffect, useState } from "react";
import "./css/ProductDetail.css";
import { FaChevronDown, FaChevronUp, FaRegHeart, FaHeart } from "react-icons/fa";
import { getProduct, getProducts } from '../features/product/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from "react-router-dom";
import { addToCart } from '../features/auth/authSlice';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { useFormik } from "formik";

function ProductDetail() {
    const [active, setActive] = useState(false);
    const [activeFavorite, setActiveFavorite] = useState(false);
    const [urlImage, setUlrImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);  // State to track selected size
    const { id } = useParams();
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getProducts());
        dispatch(getProduct(id));
    }, [dispatch, id]);

    const productState = useSelector((state) => state.product.product);
    const productsState = useSelector((state) => state.product.products);

    const schema = yup.object().shape({
        size: yup.string().required('Size is required'),
        count: yup.number().required('Count is required').min(1, 'Count must be at least 1')
    });

    const formik = useFormik({
        initialValues: {
            _id: id,
            count: 1,
            size: '',
            price: productState.price || 0  // Default to 0 if price is not available
        },
        validationSchema: schema, 
        onSubmit: values => {
            values.size = selectedSize;  // Set the selected size before submitting
            values.price = productState.price;  // Ensure price is included in the form data
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
                            <a class="btn btn-success" href="http://localhost:3000/cart">Xem giỏ hàng</a>
                        `,
                        icon: "success",
                        showCancelButton: false,
                        showConfirmButton: false,
                    });
                })
                .catch(() => {
                    Swal.fire({
                        title: "Thêm thất bại!",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                });
        },
    });

    const handleChange = (item) => () => {
        setUlrImage(item.url);
    }

    const handleClickFavorite = () => {
        setActiveFavorite(!activeFavorite);
    }

    const handleSizeClick = (size) => {
        setSelectedSize(size);  // Set the selected size
        formik.setFieldValue('size', size);  // Update formik state
    }

    const handleClick = () => {
        setActive(!active);
        setUlrImage(null);
    }

    return (
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
                    <h3 className="pb-3">{productState.title}</h3>
                    <p name="price">{productState.price}đ</p>
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
                            <div className="product-size">
                                <h5 className="mb-3">Select Size</h5>
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
                            {formik.errors.size && <p style={{ color: "red", fontSize: "13px" }} className="error">{formik.errors.size}</p>}
                            <div className="product-count">
                                <label htmlFor="count">Quantity</label>
                                <input
                                    id="count"
                                    name="count"
                                    type="number"
                                    value={formik.values.count}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    min="1"
                                />
                                {formik.errors.count && formik.touched.count && <p style={{ color: "red", fontSize: "13px" }} className="error">{formik.errors.count}</p>}
                            </div>
                            <button type="submit">Add to Bag</button>
                        </form>
                        <button className={activeFavorite ? 'active-favorite' : 'favorite'} onClick={handleClickFavorite}>
                            Favorite {activeFavorite ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                        </button>
                    </div>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus voluptatibus sed molestias exercitationem quas soluta consequatur eius aliquid rerum. Eius quas aperiam iste ipsam, ipsa illum excepturi deleniti voluptates numquam?</p>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
