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
import FormattedDate from "../components/FormattedDate";
import { FaStar } from "react-icons/fa";
import { getUser } from "../features/customer/customerSlice";

function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [currentProdId, setCurrentProdId] = useState(""); // State for storing current product ID
  const [stars, setStars] = useState(null);
  const [hover, setHover] = useState(null);
  const [info, setInfo] = useState([]);
  const [sortOders, setSortOders] = useState([]);

  const evaluate ={
    1: "Rất tệ",
    2: "Tệ",
    3: "Khá",
    4: "Tốt",
    5: "Rất tốt"
  }

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const orderState = useSelector((state) => state.order.orders);
  // sap xep theo trang thai hoa don
  const handleClick = (name) =>{
   if(name === "All"){
       setSortOders(orderState);
   }
   else{
       let order = orderState.filter(item => {
           return item.orderStatus === name;
       })
       setSortOders(order)
   } 
 }

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
          setTimeout(() => {
            dispatch(getOrders());
          }, 300);
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
          {
            user.images.length > 0 ? (<img src={user.images[0]?.url} alt="no_image" className="rounded-circle" fluid/>):(<img src="../hinh/user-none.jpg" alt="no_image" className="rounded-circle" fluid/>)
          }
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
              <Button variant="dark" onClick={()=>handleClick('All')}>Tất cả</Button>
              <Button variant="success" onClick={()=>handleClick('Unpaid')}>Chưa thanh toán</Button>
              <Button variant="danger" onClick={()=>handleClick('Pending')}>Đang xử lí</Button>
              <Button variant="primary" onClick={()=>handleClick('Shipping')}>Đang giao hàng</Button>
              <Button variant="warning" onClick={()=>handleClick('Cancelled')}>Đã hủy</Button>
              <Button variant="secondary" onClick={()=>handleClick('Delivered')}>Đã giao hàng</Button>
            </div>
            <div className="pt-3">
              {sortOders.map((item) => {
                return (
                  <div className="order-item" key={item._id}>
                    {/* <div className="time"><FormattedDate timestamp={item.createdAt}/></div> */}
                    <div className="product-details d-block">
                      {item.products.map((i) => {
                        return (
                          <div className="d-flex mb-3" key={i.product._id}>
                            <Link to={`/product/${i.product._id}`}>
                              <img
                                src={i.product.image[0].url}
                                alt="product"
                                className="product-image"
                              />
                            </Link>
                            
                            <div className="product-info">
                              <h3>{i.product.title}</h3>
                              <p>Kích thước: <span className="fw-bold">{i.size}</span></p>
                              <p>Số lượng: <span className="fw-bold">x{i.count}</span></p>
                              {item.orderStatus == "Delivered" ? (
                                <button
                                  className="btn btn-warning"
                                  onClick={() => {
                                    setShowModal(true);
                                    setCurrentProdId(i.product._id);
                                    setInfo([i.product.image[0].url,i.product.title]);
                                    setStars(null);
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
          <Modal.Title className="d-flex">
            <img src={info[0]} alt="" width={'50px'} height={'50px'}/>
            <p className="ms-3 fs-5">{info[1]}</p>
          </Modal.Title>
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
              <Form.Label className="fw-bold">Đánh giá: </Form.Label>
              {stars && evaluate[stars] && (
                  <span className="evaluation ms-2">( {evaluate[stars]} )</span>
                )}
              <div className="star-rating justify-content-center">
                {[1, 2, 3, 4, 5].map((star) => {
                  return(
                    <>
                      <label>
                        <input 
                          type="radio" 
                          name="star" 
                          value={star} 
                          checked={formik.values.star == star} 
                          onChange={formik.handleChange}
                          className="d-none"
                          onClick={()=>setStars(star)}
                        />
                        <FaStar 
                          className="fs-3 mb-2 star" 
                          color={star <= (hover || stars) ? '#ffc107' : '#e4e5e9'}
                          onMouseEnter={()=>setHover(star)}
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
              <Form.Label className="fw-bold">Bình luận:</Form.Label>
              <Form.Control
                as="textarea"
                name="comment"
                placeholder="Hãy bình luận theo cách của bạn !"
                value={formik.values.comment}
                onChange={formik.handleChange}
                isInvalid={formik.errors.comment}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.comment}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="warning" className="mt-3">Gửi đánh giá</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Account;
