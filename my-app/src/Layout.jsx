import Footer from './components/Footer';
import {Outlet } from "react-router-dom";
import Header from "./components/Navbar";
import SeeMore from "./components/SeeMore"

function Layout(){
    return(
        <>
            <Header />
            {/* <SeeMore /> */}
            <Outlet/>
            <Footer/>
        </>
    )
}

export default Layout;