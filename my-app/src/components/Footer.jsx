import "./css/Layout.css";
import { Link } from "react-router-dom";
import { GrSend } from "react-icons/gr";
import { FaYoutube,FaFacebookSquare,FaInstagramSquare,FaGithub  } from "react-icons/fa";

function Footer() {
  return (
    <>
        <footer className="py-4">
            <div className="container">
                <div className="row align-items-center">
                    {/* <div className="col-5">
                        <div className="footer-top-data d-flex align-items-center gap-30 ">
                            <GrSend className="fs-1 text-white"/>
                            <h2 className="mb-0 text-white">Sign Up For Newsletter</h2>
                        </div>
                    </div> */}
                    {/* <div className="col-7">
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Your Email Address ..."
                                aria-label="Your Email Address ..."
                                aria-describedby="basic-addon2"
                            />
                            <span className="input-group-text p-3" id="basic-addon2">
                                Subscribe
                            </span>
                        </div>
                    </div> */}
                </div>
            </div>
        </footer>
        <footer className="py-3">
            <div className="container-xxl">
                <div className="row text-white">
                    <div className="col-4">
                        <h4 className="mb-4">Liên hệ chúng tôi</h4>
                        <div>
                            <address>
                                <span className="fw-bold">Địa chỉ:</span>  65 Huỳnh Thúc Kháng, P. Bến Nghé <br /> Quận 1, TP.HCM
                            </address>
                            <a href="tel: +0123456789" className="mt-2 d-block mb-3 text-white"><span className="fw-bold">Số điện thoại:</span> 0333560276</a>
                            <a href="mailto: 0306211387@caothang.vn.edu" className="mt-2 d-block mb-1 text-white"><span className="fw-bold">Email:</span> 0306211387@caothang.vn.edu</a>
                            <div className="social-icons">
                                <a className="text-white me-3 fs-3" href=""><FaYoutube/></a>
                                <a className="text-white me-3 fs-3" href=""><FaFacebookSquare/></a>
                                <a className="text-white me-3 fs-3" href=""><FaInstagramSquare/></a>
                                <a className="text-white me-3 fs-3" href=""><FaGithub/></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <h4 className="mb-4">Hỗ trợ khách hàng</h4>
                        <div className="d-flex flex-column">
                            <Link className="text-white py-2">Chăm sóc khách hàng</Link>
                            <Link className="text-white py-2">Thanh toán</Link>
                            <Link className="text-white py-2">Hướng dẫn mua hàng</Link>
                        </div>
                    </div>
                    <div className="col-3">
                        <h4 className="mb-4">Chính sách</h4>
                        <div className="d-flex flex-column">
                            <Link className="text-white py-2">Chế độ bảo hành</Link>
                            <Link className="text-white py-2">Chính sách đổi hàng</Link>
                            <Link className="text-white py-2">Bảo mật thông tin</Link>
                            <Link className="text-white py-2">Chính sách giao nhận</Link>
                        </div>
                    </div>
                    {/* <div className="col-2">
                        <h4 className="mb-4">Quick Links</h4>
                        <div className="d-flex flex-column">
                            <Link className="text-white py-2">Nike</Link>
                            <Link className="text-white py-2">Adidas</Link>
                            <Link className="text-white py-2">Puma</Link>
                            <Link className="text-white py-2">Khac</Link>
                        </div>
                    </div> */}
                </div>
            </div>
        </footer>
        <footer className="py-2">
            <div className="container-xxl">
                <div className="row">
                    <div className="col-12">
                        <p className="text-center text-white mb-0">&copy; {new Date().getFullYear()}; Bản quyền thuộc về ShoesShop</p>
                    </div>
                </div>
            </div>
        </footer>
    </>
  );
}

export default Footer;