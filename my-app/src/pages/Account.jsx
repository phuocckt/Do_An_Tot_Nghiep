import "./css/Account.css";
import { logout } from '../features/auth/authSlice';
import Swal from 'sweetalert2';
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () =>{
    Swal.fire({
        title: 'Bạn muốn đăng xuất ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Không',
      }).then((result) => {
        if (result.isConfirmed) {
            dispatch(logout());
            Swal.fire('Đã đăng xuất !','', 'success');
            navigate("/");
        } 
      });
    }
  
  return (
    <>
        <div className="account">
            <div className="account-info">
                <h3 className="mb-3">Thông tin tài khoản</h3>
                <img src="../hinh/user-none.jpg" alt="" />
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
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="validationCustom01">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="First name"
                                defaultValue={user?.firstname}
                            />
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom02">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Last name"
                                defaultValue={user?.lastname}
                            />
                            </Form.Group>   
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="validationCustom01">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="Email"
                                defaultValue={user?.email}
                            />
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom02">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Số điện thoại"
                                defaultValue={user?.mobile}
                            />
                            </Form.Group>   
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} md="12" controlId="validationCustom01">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Địa chỉ"
                                defaultValue={user?.address}
                            />
                            </Form.Group> 
                        </Row>
                        <Button type="submit" variant="primary" className="me-3">Cập nhật thông tin</Button>
                        <Button type="submit" variant="warning">Đổi mật khẩu</Button>
                    </Form>
                </div>
            </div>
            
        </div>
    </>
  );
}

export default Account;