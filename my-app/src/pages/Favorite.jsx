import "./css/Account.css";
import { logout } from '../features/auth/authSlice';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { useEffect } from "react";
import { getUser } from "../features/customer/customerSlice";

function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null;

  useEffect(() => {
    if (userId) {
      dispatch(getUser(userId));
    }
  }, [dispatch, userId]);
  const userState = useSelector((state) => state.customer.customer);
  console.log(userState);

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
                    <Link to='/favorite'><li className="active">Danh sách yêu thích</li></Link>
                    <Link to='/order'><li>Đơn hàng</li></Link>
                </ul>

                <div className="content">
                    <h4>Danh sách yêu thích</h4>
                    <div className="favorites">
                        {/* {userState?.length > 0 ? (
                        userState?.map(item => (
                            <Card product={item.wishlist} />
                        ))
                        ) : (
                            <div>
                                <p className="mb-3">Bạn chưa có sản phẩm yêu thích</p>
                                <Link to='/products'><Button variant="success">Khám phá ngay</Button></Link>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
            
        </div>
    </>
  );
}

export default Account;