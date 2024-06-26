import { Link } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import "./css/Cart.css";
import { deleteCart, getCart } from '../features/auth/authSlice';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from 'sweetalert2';

function Cart() {
    const dispatch = useDispatch();  
    const cartState = useSelector((state) => state.auth.carts);

    useEffect(() => {
        dispatch(getCart());
    }, [dispatch]);

    const handleDelete = (proId) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có, xóa nó!',
            cancelButtonText: 'Không, hủy!',
          }).then((result) => {
            if (result.isConfirmed) {
              dispatch(deleteCart(proId))
                .unwrap()
                .then(() => {
                  Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa.', 'success');
                  dispatch(getCart());
                })
                .catch((error) => {
                  Swal.fire('Thất bại!', error.message, 'error');
                });
            }
          });
    }
    
    return (
        <div className="cart">
            <div className="cart-products">
                <div className="delivery">
                    <h5>FREE DELIVERY</h5>
                    <p>Applies to orders of 5.000.000₫ or more.</p>
                </div>
                <h3 className="py-3">Giỏ hàng</h3>
                {!cartState || !cartState.products ? (
                    <p>Giỏ hàng đang trống...</p>
                ) : (
                    <div className="products m-0 p-0">
                        <div className="cart-card d-block">
                            {cartState.products.map(item => (
                                <div key={item.product._id} className="cart-item">
                                    <div className="cart-product-info">
                                        <Link to={`/product/${item.product._id}`}>
                                            <img className='product-img' width={100} height={100} src={item.product.image[0].url} alt="Product" />
                                        </Link>
                                        <div className="cart-product-content">
                                            <h5 className="cart-product-name">{item.product.title}</h5>
                                            <div className="cart-product-price">{item.price} đ</div>
                                        </div>
                                        <div className="cart-product-select">
                                            <div className="size">
                                                <label style={{color: "black"}}>Size: {item.size}</label>
                                            </div>
                                            <div className="quantity ms-3">
                                                <label style={{color: "black"}}>Quantity: {item.count}</label>
                                            </div>
                                            <button className="action-delete ms-3 fs-5 btn" onClick={() => handleDelete(item.product._id)}><RiDeleteBin5Line/></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="cart-invoice">
                <h3 className="py-4">Summary</h3>
                <div className="invoice-info">
                    <div className="subtotal">
                        <p>Subtotal</p>
                        <p>{cartState ? cartState.cartTotal : 0} đ</p>
                    </div>
                    <div className="invoice-delivery">
                        <p>Estimated Delivery & Handling</p>
                        <p>Free</p>
                    </div>
                    <div className="total">
                        <p>Total</p>
                        <p>{cartState ? cartState.cartTotal : 0} đ</p>
                    </div>
                </div>
                <div className="invoice-action">
                    <button>Guest Checkout</button>
                    <button>Member Checkout</button>
                </div>
            </div>
        </div>
    );
}

export default Cart;
