import "./css/Account.css";
import { logout } from '../features/auth/authSlice';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import { useFormik } from "formik";
import * as yup from 'yup';
import { getUser, updatePassword, updateUser } from "../features/customer/customerSlice";
import { useEffect, useState } from "react";

function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector( state => state.auth.user);

  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    if (user) {
      navigate('/account')
      formik.setValues({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        mobile: user.mobile || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Bạn muốn đăng xuất?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Không',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        Swal.fire('Đã đăng xuất!', '', 'success');
        navigate("/");
      }
    });
  }

  let schema = yup.object().shape({
    firstname: yup.string().required('Firstname is required'),
    lastname: yup.string().required('Lastname is required'),
    email: yup.string().required('Email is required').email('Invalid email format'),
    mobile: yup.string().required('Mobile is required').matches(/^[0-9]+$/, 'Chỉ được nhập kí tự số'),
    address: yup.string()
  });

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      mobile: '',
      address: ''
    },
    validationSchema: schema,
    onSubmit: values => {
        Swal.fire({
            title: 'Bạn chắc chắn muốn đổi?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
          }).then((result) => {
            if (result.isConfirmed) {
                dispatch(updateUser(values))
                .unwrap()
                .then(() => {
                  Swal.fire({
                    title: "Sửa thành công!",
                    icon: "success",
                    confirmButtonText: "OK",
                  });
                  navigate("/account");
                })
                .catch(() => {
                  Swal.fire({
                    title: "Sửa thất bại!",
                    icon: "error",
                    confirmButtonText: "OK",
                  });
                });
            }
          });
    },
  });

  const passwordSchema = yup.object().shape({
    oldPassword: yup.string().required('Mật khẩu cũ là bắt buộc'),
    newPassword: yup.string().required('Mật khẩu mới là bắt buộc').min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  });

  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
    },
    validationSchema: passwordSchema,
    onSubmit: values => {
        dispatch(updatePassword(values))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Đổi mật khẩu thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
          setShowModal(false);
        })
        .catch((error) => {
          Swal.fire({
            title: "Đổi mật khẩu thất bại!",
            text: error.message || 'Có lỗi xảy ra, vui lòng thử lại.',
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
            user.images.length > 0 ? (<img src={user.images[0]?.url} alt="no_image" className="rounded-circle" style={{ width: '150px' }} fluid/>):(<img src="../hinh/user-none.jpg" alt="no_image" className="rounded-circle" style={{ width: '150px' }} fluid/>)
          }
          <h3>{user?.firstname + ' ' + user?.lastname}</h3>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
        <div className="account-content">
          <ul className="account-menu">
            <Link to='/account'><li className="active">Thông tin tài khoản</li></Link>
            <Link to='/favorite'><li>Danh sách yêu thích</li></Link>
            <Link to='/order'><li>Đơn hàng</li></Link>
          </ul>

          <div className="content">
            <h4>Thông tin tài khoản</h4>
            <Form onSubmit={formik.handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="firstname"
                    placeholder="First name"
                    value={formik.values.firstname}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="lastname"
                    placeholder="Last name"
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="mobile"
                    placeholder="Số điện thoại"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="validationCustom01">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    placeholder="Địa chỉ"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </Row>
              <Button type="submit" variant="primary" className="me-3">Cập nhật thông tin</Button>
              <Button type="button" variant="warning" onClick={() => setShowModal(true)}>Đổi mật khẩu</Button>
            </Form>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Đổi mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={passwordFormik.handleSubmit}>
            <Form.Group controlId="formOldPassword">
              <Form.Label>Mật khẩu cũ</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                placeholder="Nhập mật khẩu cũ"
                value={passwordFormik.values.oldPassword}
                onChange={passwordFormik.handleChange}
                isInvalid={passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordFormik.errors.oldPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formNewPassword">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                placeholder="Nhập mật khẩu mới"
                value={passwordFormik.values.newPassword}
                onChange={passwordFormik.handleChange}
                isInvalid={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
              />
              <Form.Control.Feedback type="invalid">
                {passwordFormik.errors.newPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">Đổi mật khẩu</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Account;
