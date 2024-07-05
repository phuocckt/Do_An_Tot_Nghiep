import { Link } from "react-router-dom";
import "./css/Home.css";
import { IoIosFlash } from "react-icons/io";
import { FaBlogger } from "react-icons/fa";
import Carousel from "../components/Carousel/Carousel";
import Wrapper from "../components/wrapper/Wrapper";
import Blogs from "../components/News/News";
import Products from './Products';
import Slider from "../components/Slider/Slider";
import Brand from "../components/Brand/Brand";



function Home() {
  return (
    <>
        <Slider />
        <div className="p-5">
            <Brand />
            <Blogs />
        </div>
        
        <section className="home-wrapper-1 pb-5">
            <div className="container-xxl ">
                <div className="row mb-5">
                    <h3 className='mb-2'><IoIosFlash className='me-2 blink'/>Flash Sale</h3>
                    <div className="col-6">
                        <div className="main-banner position-relative p-3">
                            <img className="img-fluid rounded-3" src="../hinh/nike-1.png" alt="" />
                            {/* <div className="main-banner-content position-absolute">
                                <h4>SUPERCHARGER FOR PROS</h4>
                                <h5>Nike Retro Remeum</h5>
                                <p>From 3.000.000đ or 500.000đ/mo</p>
                                <Link className="button">BUY NOW</Link>
                            </div> */}
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="small-banner position-relative p-3">
                                <img className="img-fluid rounded-3" src="../hinh/nike-1.png" alt="" />
                                {/* <div className="small-banner-content position-absolute">
                                    <h4>SUPERCHARGER FOR PROS</h4>
                                    <h5>Nike Retro Remeum</h5>
                                    <p>From 3.000.000đ or 500.000đ/mo</p>
                                    <Link className="button">BUY NOW</Link>
                                </div> */}
                            </div>
                        </div>
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="small-banner position-relative p-3">
                                <img className="img-fluid rounded-3" src="../hinh/nike-1.png" alt="" />
                                {/* <div className="small-banner-content position-absolute">
                                    <h4>SUPERCHARGER FOR PROS</h4>
                                    <h5>Nike Retro Remeum</h5>
                                    <p>From 3.000.000đ or 500.000đ/mo</p>
                                    <Link className="button">BUY NOW</Link>
                                </div> */}
                            </div>
                        </div>
                        
                    </div>
                    <div className="col-3">
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="small-banner position-relative p-3">
                                <img className="img-fluid rounded-3" src="../hinh/nike-1.png" alt="" />
                                {/* <div className="small-banner-content position-absolute">
                                    <h4>SUPERCHARGER FOR PROS</h4>
                                    <h5>Nike Retro Remeum</h5>
                                    <p>From 3.000.000đ or 500.000đ/mo</p>
                                    <Link className="button">BUY NOW</Link>
                                </div> */}
                            </div>
                        </div>
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="small-banner position-relative p-3">
                                <img className="img-fluid rounded-3" src="../hinh/nike-1.png" alt="" />
                                {/* <div className="small-banner-content position-absolute">
                                    <h4>SUPERCHARGER FOR PROS</h4>
                                    <h5>Nike Retro Remeum</h5>
                                    <p>From 3.000.000đ or 500.000đ/mo</p>
                                    <Link className="button">BUY NOW</Link>
                                </div> */}
                            </div>
                        </div>
                        
                    </div>
                </div>
                {/* <Products /> */}
                
            <Wrapper />
                
            </div>
        </section>
        
    </>
  );
}

export default Home;