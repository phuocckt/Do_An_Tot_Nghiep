import Header from './components/Header';
import Footer from './components/Footer';
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header2 from "./components/Slider/Slider";
import Account from './pages/Account';
import './Layout.css'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from './features/auth/authSlice';
import Swal from 'sweetalert2';


function Layout(){
    const [scrolled, setScrolled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = localStorage.getItem("user");
    const userData = JSON.parse(user);
    const userId = userData?._id;

    const handleLogout = () =>{
        dispatch(logout());
        Swal.fire({
            title: "Đăng xuất thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
        navigate("/");
    }

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);
    return(
        <>
            <header className={scrolled ? "scrolled" : ""}>
                <Link to='/' class="logo">
                    <img src="../hinh/logo.png" alt="" />
                </Link>
                <nav>
                    <ul>
                        <Link to='/'><li>HOME</li></Link>
                        <Link to='/products'><li>PRODUCTS</li></Link>
                        <Link to='/account'><li>INFO</li></Link>
                        <Link to='/cart'><li>CART</li></Link>
                        {
                            userId == null || user == null? (<><Link to='/login'><li>LOGIN</li></Link>
                        <Link to='/register'><li>REGISTER</li></Link></>):(<><Link to='/'><li onClick={handleLogout}>LOGOUT</li></Link></>)
                        }
                    </ul>
                </nav>
            </header>
            <Outlet/>
            <Footer/>
        </>
    )
}

export default Layout;