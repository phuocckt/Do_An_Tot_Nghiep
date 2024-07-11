import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import Header from "./components/Navbar";
import SeeMore from "./components/SeeMore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCart } from "./features/auth/authSlice";

function Layout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.auth.carts);

  useEffect(() => {
    setTimeout(() => {
      dispatch(getCart());
    }, 500);
  }, [user?._id]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Header />
      {/* <SeeMore /> */}
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
