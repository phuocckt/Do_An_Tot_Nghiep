import { Link, useLocation } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../styles/cart.css";
import {
  applyCoupon,
  deleteCart,
  getCart,
  payment,
} from "../features/auth/authSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as yup from "yup";
import { createOrder, createPaymentOrder } from "../features/order/orderSlice";
import { CurrencyFormatter } from "../components/CurrencyFormatter";
import { getUser } from "../features/customer/customerSlice";

function Cart() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [totalPrice, setTotalPrice] = useState(0);
  const [activeBtn, setActiveBtn] = useState(false);
  const cartState = useSelector((state) => state.auth.carts);
  const userState = useSelector((state) => state.customer.customer);

  useEffect(() => {
    //dispatch(getCart());
    dispatch(getUser(user._id));
    const total = cartState.products?.reduce(
      (acc, item) => acc + item.price,
      0
    );
    setTotalPrice(total);
  }, [dispatch]);

  let schema = yup.object().shape({
    COD: yup.boolean().required("COD is required"),
  });

  const paymentFormik = useFormik({
    initialValues: {
      orderType: "billpayment",
      amount: cartState?.cartTotal || 0,
      orderDescription: "paymentOrder",
      language: "vn",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(payment(values))
        .unwrap()
        .then((url) => {
          window.location.href = url;
        })
        .catch(() => {
          Swal.fire({
            title: "Thanh toán thất bại!",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    },
  });

  const formik = useFormik({
    initialValues: {
      COD: true,
      couponApplied: false,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (!userState.address) {
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
          dispatch(getCart());
        })
        .catch(() => {
          Swal.fire({
            title: "Chưa có sản phẩm trong giỏ hàng!",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    },
  });

  const formikCoupon = useFormik({
    initialValues: {
      coupon: "",
    },
    onSubmit: (values) => {
      dispatch(applyCoupon(values))
        .unwrap()
        .then(() => {
          dispatch(getCart());
        })
        .catch(() => {
          Swal.fire({
            title: "Mã không tồn tại!",
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

const handleClick=()=>{
  setActiveBtn(true);
}
const handleReload = () => {
  window.location.reload();
};

  return (
    <div className="cart">
      <div className="cart-products">
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
                      </div>
                    </div>
                    <div className="cart-product-select">
                      <div className="size">
                        <label style={{ color: "black" }}>
                          Kích thước:{" "}
                          <span className="fw-bold">{item.size}</span>
                        </label>
                      </div>
                      <div className="quantity ms-3">
                        <label style={{ color: "black" }}>
                          Số lượng:{" "}
                          <span className="fw-bold">x{item.count}</span>
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
          <div className="invoice-delivery align-items-center">
            <p>Voucher giảm giá:</p>
            <form className="d-flex" onSubmit={formikCoupon.handleSubmit}>
              <input
                name="coupon"
                type="text"
                value={formikCoupon.values.coupon}
                className="py-2 px-2"
                placeholder="Nhập voucher"
                onChange={formikCoupon.handleChange}
              />
              <button className="btn btn-secondary ms-2 py-2" type="submit" onClick={handleClick} hidden={activeBtn}>
                Áp dụng
              </button>
              <button className="btn btn-secondary ms-2 py-2" type="button" onClick={handleReload} hidden={!activeBtn}>
                Hủy voucher
              </button>
            </form>
          </div>
          <div className="total align-items-end">
            <p>Thành tiền:</p>
            <div className="text-end">
              <p className="text-decoration-line-through " hidden={!activeBtn}>
                <CurrencyFormatter amount={totalPrice} />
              </p>
              <p className='text-danger fs-5'>
                <CurrencyFormatter
                  amount={cartState ? cartState.cartTotal : 0}
                />
              </p>
            </div>
          </div>
        </div>
        <div className="invoice-action">
          <p className="fw-bold mb-1">Hình thức thanh toán:</p>
          <form onSubmit={formik.handleSubmit}>
            <div className="payment-method mb-3 ps-3">
              <div>
                <input
                  type="hidden"
                  name="COD"
                  value={true}
                  checked={formik.values.COD === true}
                  onChange={() => formik.setFieldValue("COD", true)}
                  className="me-2"
                />
              </div>
            </div>
            <button type="submit" onClick={handleClick}>Thanh toán khi nhận hàng</button>
          </form>
          <form onSubmit={paymentFormik.handleSubmit}>
            <input
              type="hidden"
              name="orderDescription"
              value={paymentFormik.values.orderDescription}
            />
            <input
              type="hidden"
              name="amount"
              value={paymentFormik.values.amount}
            />
            <input
              type="hidden"
              name="orderType"
              value={paymentFormik.values.orderType}
            />
            <input
              type="hidden"
              name="language"
              value={paymentFormik.values.language}
            />
            <button type="submit" name="redirect">
              Thanh toán trực tuyến
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cart;
