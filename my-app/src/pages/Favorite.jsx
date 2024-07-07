import "./css/Account.css";
import { logout } from '../features/auth/authSlice';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useEffect } from "react";
import { getUser } from "../features/customer/customerSlice";
import { CurrencyFormatter } from "../components/CurrencyFormatter";
import { RiDeleteBin5Line } from "react-icons/ri";
import { addWishlist, getProduct } from "../features/product/productSlice";
import { useFormik } from "formik";


function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector( state => state.auth.user);
  const userId = user ? user._id : null;

  useEffect(() => {
    if (userId) {
      navigate('/favorite');
      dispatch(getUser(userId));
    }
  }, [dispatch, userId]);
  const userState = useSelector((state) => state.customer.customer);

  const formikFavorite = useFormik({
    initialValues: {
      prodId: ''
    },
    onSubmit: values => {
      dispatch(addWishlist(values));
    },
  });

  const handleFavoriteClick = (id) => {
    formikFavorite.values.prodId = id;
    setTimeout(() => {
      dispatch(getUser(userId));
    }, 300);
  };

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
                {
                  user.images.length > 0 ? (<img src={user.images[0]?.url} alt="no_image" className="rounded-circle" fluid/>):(<img src="../hinh/user-none.jpg" alt="no_image" className="rounded-circle" fluid/>)
                }
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
                        {userState !== null ? (
                            userState.wishlist?.map(item => {
                              return (
                                <>
                                  <div className="card-favorite">
                                    <img className='product-img' src={item.image?.[0].url} alt="Ảnh sản phẩm"/>
                                    <div className="content">
                                      <h6 className="m-0">{item.title}</h6>
                                      <p className="text-danger"><CurrencyFormatter amount={item.price}/></p>
                                      <div className="action d-flex justify-content-between mt-2">
                                        <form className="ms-2 del" onSubmit={formikFavorite.handleSubmit}>
                                            <input type="hidden" name="prodId" value={formikFavorite.values.prodId}/>
                                            <button type="submit" onClick={()=>handleFavoriteClick(item._id)} className="del">
                                              <RiDeleteBin5Line className="fs-5"/>
                                            </button>
                                        </form>
                                        <Link to={`/product/${item._id}`}>Xem chi tiết</Link>
                                      </div>
                                    </div>
                                    
                                  </div>
                                </>
                                
                              )
                            })
                        ) : (
                            <div>
                                <p className="mb-3">Bạn chưa có sản phẩm yêu thích</p>
                                <Link to='/products'><Button variant="success">Khám phá ngay</Button></Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
        </div>
    </>
  );
}

export default Account;