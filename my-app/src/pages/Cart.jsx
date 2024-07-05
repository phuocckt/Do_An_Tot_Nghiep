import { Link } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import "./css/Cart.css";
import { deleteCart, getCart } from "../features/auth/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as yup from "yup";
import { createOrder } from "../features/order/orderSlice";
import { CurrencyFormatter } from "../components/CurrencyFormatter";

function Cart() {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.auth.carts);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  let schema = yup.object().shape({
    COD: yup.boolean().required("COD is required"),
  });

  const formik = useFormik({
    initialValues: {
      COD: false,
      couponApplied: false,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (!user.address) {
        Swal.fire({
          title: "Lỗi!",
          text: "Người dùng chưa nhập địa chỉ.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      dispatch(createOrder(values))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Đặt hàng thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
          dispatch(getCart())
        })
        .catch(() => {
          Swal.fire({
            title: "Đặt hàng thất bại!",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    },
  });

  const handleDelete = (proId) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, xóa nó!",
      cancelButtonText: "Không, hủy!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCart(proId))
          .unwrap()
          .then(() => {
            Swal.fire("Đã xóa!", "Sản phẩm đã được xóa.", "success");
            dispatch(getCart());
          })
          .catch((error) => {
            Swal.fire("Thất bại!", error.message, "error");
          });
      }
    });
  };

  return (
    <div className="cart">
      <div className="cart-products">
        {/* <div className="delivery">
          <h5>FREE DELIVERY</h5>
          <p>Applies to orders of 5.000.000₫ or more.</p>
        </div> */}
        <h3 className="py-3 right-cart">Giỏ hàng</h3>
        {!cartState || !cartState.products ? (
          <p>Giỏ hàng đang trống...</p>
        ) : (
          <div className="products m-0 p-0">
            <div className="cart-card d-block">
              {cartState.products.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <Link to={`/product/${item.product._id}`}>
                    <img
                      className="product-img me-3"
                      width={150}
                      height={200}
                      src={item.product.image[0].url}
                      alt="Product"
                    />
                  </Link>
                  <div className="cart-product-info w-100">
                    <div className="cart-product-content">
                      <h5 className="cart-product-name">
                        {item.product.title}
                      </h5>
                      <div className="cart-product-price text-danger">
                        <CurrencyFormatter amount={item.price} />
                        /1
                      </div>
                    </div>
                    <div className="cart-product-select">
                      <div className="size">
                        <label style={{ color: "black" }}>
                          Kích thước: <span className="fw-bold">{item.size}</span>
                        </label>
                      </div>
                      <div className="quantity ms-3">
                        <label style={{ color: "black" }}>
                          Số lượng: <span className="fw-bold">x{item.count}</span>
                        </label>
                      </div>
                      <button
                        className="action-delete ms-3 fs-5 btn"
                        onClick={() => handleDelete(item.product._id)}
                      >
                        <RiDeleteBin5Line />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="cart-invoice">
        <h3 className="py-3">Thông tin thanh toán</h3>
        <div className="invoice-info">
          <div className="subtotal">
            <p>Tổng tiền:</p>
            <p>
              <CurrencyFormatter amount={cartState ? cartState.cartTotal : 0} />
            </p>
          </div>
          <div className="invoice-delivery align-items-center">
            <p>Voucher giảm giá:</p>
            <input type="text" className="py-1 px-2" placeholder="Nhập voucher"/>
          </div>
          <div className="total">
            <p>Thành tiền:</p>
            <p>
              <CurrencyFormatter amount={cartState ? cartState.cartTotal : 0} />
            </p>
          </div>
        </div>
        <div className="invoice-action">
          <p className="fw-bold mb-1">Hình thức thanh toán:</p>
          <form onSubmit={formik.handleSubmit}>
            <div className="payment-method mb-3 ps-3">
              <div>
                <input
                  type="radio"
                  name="COD"
                  value={true}
                  checked={formik.values.COD === true}
                  onChange={() => formik.setFieldValue('COD', true)}
                  className="me-2"
                />
                <span>Thanh toán khi nhận hàng</span>
              </div>
              <div className="d-none">
                <input
                  type="radio"
                  name="couponApplied"
                  placeholder="Mã giảm giá"
                  value={formik.values.couponApplied}
                  onChange={formik.handleChange}
                  className="me-2"
                />
                Thanh toán trước bằng ngân hàng
              </div>
              
            </div>
            <button type="submit">Đặt hàng</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cart;
