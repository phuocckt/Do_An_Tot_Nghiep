import "./css/Account.css";
import { logout } from '../features/auth/authSlice';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { useEffect } from "react";
import { getOrders } from "../features/order/orderSlice";

function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    dispatch(getOrders());
  },[dispatch]);
  const orderState = useSelector(state => state.order.orders);

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
                    <Link to='/account'><li>Thông tin tài khoản</li></Link>
                    <Link to='/favorite'><li>Danh sách yêu thích</li></Link>
                    <Link to='/order'><li className="active">Đơn hàng</li></Link>
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
                    <div className="p-5 pt-3">
                      {
                        orderState.map(item => {
                          return (
                            <p>{item._id}</p>
                            // item.products.map(i => {
                            //   return(
                            //     <p>{i.product.title}</p>
                            //   )
                            // })
                          )
                        })
                      }
                        <p className="mb-3">Bạn chưa có lịch sử mua hàng</p>
                        <Link to='/cart'><Button variant="success">Kiểm tra giỏ hàng</Button></Link>
                    </div>
                </div>
            </div>
            
        </div>
    </>
  );
}

export default Account;