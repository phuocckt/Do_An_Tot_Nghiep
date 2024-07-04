import "./css/Account.css";
import { logout } from "../features/auth/authSlice";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { getOrders } from "../features/order/orderSlice";
import "./css/order.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { rating } from "../features/product/productSlice";
import { CurrencyFormatter } from "../components/CurrencyFormatter";
import { FaStar } from "react-icons/fa";

function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [currentProdId, setCurrentProdId] = useState(""); // State for storing current product ID
  const [stars, setStars] = useState(null);
  const [hover, setHover] = useState(null);
  const evaluate ={
    
  }

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);
  const orderState = useSelector((state) => state.order.orders);

  const handleLogout = () => {
    Swal.fire({
      title: "Bạn muốn đăng xuất ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Không",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        Swal.fire("Đã đăng xuất !", "", "success");
        navigate("/");
      }
    });
  };

  const Schema = yup.object().shape({
    star: yup.number().required("Vui lòng chọn số sao"),
    comment: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      star: "",
      prodId: "",
      comment: "",
    },
    validationSchema: Schema,
    onSubmit: (values) => {
      values.prodId = currentProdId; // Set the current product ID to the form values
      dispatch(rating(values))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Đánh giá thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
          setShowModal(false);
        })
        .catch((error) => {
          Swal.fire({
            title: "Đánh giá thất bại!",
            text: error.message || "Có lỗi xảy ra, vui lòng thử lại.",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    },
  });

  return (
    <>
      <div className="account">
        <div className="account-info">
          <h3 className="mb-3">Thông tin tài khoản</h3>
          <img src="../hinh/user-none.jpg" alt="" />
          <h3>{user?.firstname + " " + user?.lastname}</h3>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
        <div className="account-content">
          <ul className="account-menu">
            <Link to="/account">
              <li>Thông tin tài khoản</li>
            </Link>
            <Link to="/favorite">
              <li>Danh sách yêu thích</li>
            </Link>
            <Link to="/order">
              <li className="active">Đơn hàng</li>
            </Link>
          </ul>

          <div className="content">
            <h4>Đơn hàng của bạn</h4>
            <div className="order-status">
              <Button variant="dark">Tất cả</Button>
              <Button variant="success">Đã mua</Button>
              <Button variant="danger">Đã hủy</Button>
              <Button variant="primary">Đang giao</Button>
              <Button variant=""></Button>
              <Button variant=""></Button>
            </div>
            <div className="pt-3">
              {orderState.map((item) => {
                return (
                  <div className="order-item" key={item._id}>
                    <div className="product-details d-block">
                      {item.products.map((i) => {
                        return (
                          <div className="d-flex mb-3" key={i.product._id}>
                            <img
                              src={i.product.image[0].url}
                              alt="product"
                              className="product-image"
                            />
                            <div className="product-info">
                              <h3>{i.product.title}</h3>
                              <p>Kích thước: <span className="fw-bold">{i.size}</span></p>
                              <p>Số lượng: <span className="fw-bold">x{i.count}</span></p>
                              {item.orderStatus == "Pending" ? (
                                <button
                                  className="btn btn-warning"
                                  onClick={() => {
                                    setShowModal(true);
                                    setCurrentProdId(i.product._id);
                                  }}
                                >
                                  Đánh giá
                                </button>
                              ) : (
                                ""
                              )}
                              {i.product.ratings?.map((rat) => {
                                return rat.postedby == user._id ? (
                                  <p className="fst-italic text-danger">Sản phẩm đã được bạn đánh giá {rat.star} sao.</p>
                                ) : (
                                  ""
                                );
                              })}
                            </div>
                            <div className="product-price">
                              {i.product.priceOld != null ? (
                                <span className="original-price">
                                  <CurrencyFormatter amount={i.product.priceOld}/>
                                </span>
                              ) : (
                                <span className="original-price"></span>
                              )}
                              <span className="discounted-price">
                                <CurrencyFormatter amount={i.product.price}/>/1
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="order-footer">
                      <span>
                        Thành tiền: <CurrencyFormatter className="text-danger fw-bold fs-4" amount={item.paymentIntent.amount}/>
                      </span>
                      <span></span>
                      {item.orderStatus == "Pending" ||
                      item.orderStatus == "Unpaid" ? (
                        <button className="btn btn-danger">
                          Hủy đơn hàng
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Đánh giá</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group>
              <Form.Control
                type="hidden"
                name="prodId"
                value={formik.values.prodId}
                onChange={formik.handleChange}
              />
              <Form.Label>Đánh giá sao</Form.Label>
              {/* <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Form.Check
                    inline
                    key={star}
                    type="radio"
                    label={star}
                    name="star"
                    value={star}
                    checked={formik.values.star == star}
                    onChange={formik.handleChange}
                  />
                ))}
              </div> */}
              <div className="star-rating">
                {[...Array(5)].map((star, index) => {
                  const currentRating = index + 1;
                  return(
                    <>
                      <label>
                        <input 
                          type="radio" 
                          name="star" 
                          value={stars} 
                          checked={formik.values.star == stars} 
                          onChange={formik.handleChange}
                          className="d-none"
                          onClick={()=>setStars(currentRating)}
                        />
                        <FaStar 
                          className="fs-2 mb-2 star" 
                          color={currentRating <= (hover || stars) ? '#ffc107' : '#e4e5e9'}
                          onMouseEnter={()=>setHover(currentRating)}
                          onMouseLeave={()=>setHover(null)}
                        />
                      </label>
                    </>
                  )
                })}
              </div>
              <Form.Control.Feedback type="invalid">{formik.errors.star}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formComment">
              <Form.Label>Bình luận</Form.Label>
              <Form.Control
                as="textarea"
                name="comment"
                placeholder="Hãy bình luận theo cách của bạn!"
                value={formik.values.comment}
                onChange={formik.handleChange}
                isInvalid={formik.errors.comment}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.comment}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">Gửi đánh giá</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Account;
