import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import Header from "./components/Navbar";
import SeeMore from "./components/SeeMore";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./views/Login";
import Avatar from "./components/Avatar";

function Layout() {
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
      {/* <Avatar /> */}
      {/* <Login/> */}
      {/* <SeeMore /> */}
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
