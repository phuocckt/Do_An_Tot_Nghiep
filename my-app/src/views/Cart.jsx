import { Link, useLocation } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../styles/cart.css";
import {
  applyCoupon,
  deleteCart,
  deleteCoupon,
  getCart,
  payment,
} from "../features/auth/authSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as yup from "yup";
import { createOrder } from "../features/order/orderSlice";
import { CurrencyFormatter } from "../components/CurrencyFormatter";
import { getUser, updateUser } from "../features/customer/customerSlice";
import { toast } from "react-toastify";
import { getCoupons } from "../features/coupon/couponSlice";
import { Button, Form, Modal } from "react-bootstrap";

function Cart() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [activeBtn, setActiveBtn] = useState(false);
  const [total, setTotal] = useState(0);
  const cartState = useSelector((state) => state.auth.carts);
  const userState = useSelector((state) => state.customer.customer);
  const couponState = useSelector((state) => state.coupon.coupons);
  const [voucher, setVoucher] = useState("");
  const [modalShow, setModalShow] = useState(false);
  let finalAmount =
    cartState?.totalAfterDiscount > 0
      ? cartState.totalAfterDiscount
      : cartState?.cartTotal;

  useEffect(() => {
    dispatch(getCart());
    dispatch(getUser(user._id));
    // dispatch(getCoupons());
    // if (voucher !== "") {
    //   const discount =
    //     couponState.find((item) => item.name === voucher)?.discount || 0;
    //   const newTotal =
    //     cartState.cartTotal - (cartState.cartTotal * discount) / 100;
    //   setTotal(newTotal);
    // } else {
    //   setTotal(cartState.cartTotal || 0);
    // }
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
      if (!userState.address) {
        Swal.fire({
          title: "Lỗi!",
          text: "Người dùng chưa nhập địa chỉ.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      if (cartState?.cartTotal == 0) {
        toast.error("Giỏ hàng đang trống !");
        return;
      }
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
          html: `
              <p class="mb-4">Bạn chưa cung cấp địa chỉ giao hàng!</p>
              <a class="btn btn-warning" href="/account">Cập nhật</a>
            `,
          icon: "warning",
          showCancelButton: false,
          showConfirmButton: false,
        });
        return;
      }
      if (cartState?.cartTotal == 0) {
        toast.error("Giỏ hàng đang trống !");
        return;
      }
      dispatch(createOrder(values))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Đặt hàng thành công!",
            icon: "success"
          });
          dispatch(getCart());
        })
        .catch(() => {
          toast.error("Giỏ hàng đang trống !");
        });
    },
  });

  const formikCoupon = useFormik({
    initialValues: {
      coupon: "",
    },
    onSubmit: (values) => {
      if (values.coupon == "") {
        Swal.fire({
          title: "Vui lòng nhập mã giảm giá!",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      dispatch(applyCoupon(values))
        .unwrap()
        .then((v) => {
          setVoucher(v);
          setActiveBtn(true);
          dispatch(getCart());
        })
        .catch(() => {
          toast.error("Mã giảm giá không tồn tại !");
        });
    },
  });
  // Xóa sản phẩm trong giỏ hàng
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
            toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
            dispatch(getCart());
          })
          .catch((error) => {
            Swal.fire("Thất bại!", error.message, "error");
          });
      }
    });
  };
  // Hủy voucher
  const handleReload = () => {
    dispatch(deleteCoupon({ coupon: voucher }))
      .unwrap()
      .then(() => {
        dispatch(getCart());
      })
      .catch(() => {
        toast.error("Mã giảm giá không tồn tại !");
      });
    setActiveBtn(false);
  };
  console.log("voucher", voucher);

  // Thông tin người mua
  let schema2 = yup.object().shape({
    mobile: yup
      .string()
      .required("Mobile is required")
      .matches(/^[0-9]+$/, "Chỉ được nhập kí tự số"),
    address: yup.string(),
  });

  const infoFormik = useFormik({
    initialValues: {
      firstname: userState.firstname || "",
      lastname: userState.lastname || "",
      email: userState.email || "",
      mobile: userState.mobile || "",
      address: userState.address || "",
    },
    enableReinitialize: true,
    validationSchema: schema2,
    onSubmit: (values) => {
      dispatch(updateUser(values))
        .unwrap()
        .then(() => {
          toast.success("Cập nhật thông tin thành công !");
          setTimeout(() => {
            dispatch(getUser(user._id));
          }, 200);
        })
        .catch(() => {
          toast.success("Cập nhật thông tin thất bại !");
        });
    },
  });

  return (
    <>
      <div className="cart">
        <div className="cart-products">
          <h3 className="py-3 right-cart">Giỏ hàng</h3>
          {!cartState || !cartState?.products ? (
            <p>Giỏ hàng đang trống...</p>
          ) : (
            <div className="products m-0 p-0">
              <div className="cart-card d-block">
                {cartState?.products.map((item) => (
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
                <button className="btn btn-secondary ms-2 py-2" type="submit">
                  Áp dụng
                </button>
                {/* <button className="btn btn-secondary ms-2 py-2" type="button" onClick={handleReload} >
                Hủy voucher
              </button> */}
              </form>
            </div>
            <div className="total align-items-end border-none">
              <p>Thành tiền:</p>
              <div className="text-end">
                <p
                  className="text-decoration-line-through"
                  hidden={cartState?.cartTotal == finalAmount}
                >
                  <CurrencyFormatter
                    amount={
                      cartState?.cartTotal != finalAmount &&
                      cartState?.cartTotal
                    }
                  />
                </p>
                <span
                  hidden={cartState?.cartTotal == finalAmount}
                  className="text-danger"
                >
                  (-{100 - (finalAmount * 100) / cartState?.cartTotal}%)
                </span>
                <p className="text-danger fs-5">
                  <CurrencyFormatter
                    amount={
                      cartState && cartState?.cartTotal > 0 ? finalAmount : 0
                    }
                    // amount={total == 0 ? cartState.cartTotal : total}
                  />
                </p>
              </div>
            </div>
            <div className="total align-items-center">
              <p>
                Thông tin người đặt:
                <span
                  className="fw-normal btn"
                  onClick={() => setModalShow(true)}
                >
                  (Xem chi tiết)
                </span>
              </p>
              <p>{userState.firstname + " " + userState.lastname}</p>
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
              <button type="submit">
                Thanh toán khi nhận hàng
              </button>
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

      <Modal
        show={modalShow}
        size="ms"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => setModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Thông tin người mua
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formOldPassword">
              <Form.Label className="fw-bold">Họ tên:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Họ tên"
                value={userState.firstname + " " + userState.lastname}
                disabled
              />
            </Form.Group>

            <Form.Group controlId="formOldPassword">
              <Form.Label className="fw-bold mt-2">Số điện thoại:</Form.Label>
              <Form.Control
                required
                type="text"
                name="mobile"
                placeholder="Số điện thoại"
                value={userState.mobile}
                disabled
              />
            </Form.Group>

            <Form.Group controlId="formNewPassword">
              <Form.Label className="fw-bold mt-2">Địa chỉ:</Form.Label>
              <Form.Control
                type="text"
                name="address"
                placeholder="Bạn chưa cung cấp địa chỉ."
                value={userState.address}
                disabled
              />
            </Form.Group>

            <div className="mt-3 d-flex justify-content-between">
              <Link to={"/account"} className="btn btn-warning">
                Cập nhật thông tin
              </Link>
              <Button
                type="button"
                variant="danger"
                onClick={() => setModalShow(false)}
              >
                Đóng
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Cart;
