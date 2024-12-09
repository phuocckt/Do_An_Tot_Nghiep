import "./css/Layout.css";
import { Link } from "react-router-dom";
import { GrSend } from "react-icons/gr";
import { FaYoutube,FaFacebookSquare,FaInstagramSquare,FaGithub  } from "react-icons/fa";

function Footer() {
  return (
    <>
        <footer className="py-3" style={{ backgroundColor: "#dedfe0"}}>
            <div className="container-xxl">
                <div className="row text-dark">
                    <div className="col-4">
                        <h4 className="mb-4">Liên hệ chúng tôi</h4>
                        <div>
                            <address>
                                <span className="fw-bold">Địa chỉ:</span>  65 Huỳnh Thúc Kháng, P. Bến Nghé <br /> Quận 1, TP.HCM
                            </address>
                            <a href="tel: +0123456789" className="mt-2 d-block mb-3 text-dark"><span className="fw-bold">Số điện thoại:</span> 0333560276</a>
                            <a href="mailto: 0306211387@caothang.vn.edu" className="mt-2 d-block mb-1 text-dark"><span className="fw-bold">Email:</span> 0306211387@caothang.vn.edu</a>
                            <div className="social-icons">
                                <a className="text-dark me-3 fs-3" href=""><FaYoutube/></a>
                                <a className="text-dark me-3 fs-3" href=""><FaFacebookSquare/></a>
                                <a className="text-dark me-3 fs-3" href=""><FaInstagramSquare/></a>
                                <a className="text-dark me-3 fs-3" href=""><FaGithub/></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <h4 className="mb-4">Hỗ trợ khách hàng</h4>
                        <div className="d-flex flex-column">
                            <Link className="text-dark py-2">Chăm sóc khách hàng</Link>
                            <Link className="text-dark py-2">Thanh toán</Link>
                            <Link className="text-dark py-2">Hướng dẫn mua hàng</Link>
                        </div>
                    </div>
                    <div className="col-3">
                        <h4 className="mb-4">Chính sách</h4>
                        <div className="d-flex flex-column">
                            <Link className="text-dark py-2">Chế độ bảo hành</Link>
                            <Link className="text-dark py-2">Chính sách đổi hàng</Link>
                            <Link className="text-dark py-2">Bảo mật thông tin</Link>
                            <Link className="text-dark py-2">Chính sách giao nhận</Link>
                        </div>
                    </div>
                    {/* <div className="col-2">
                        <h4 className="mb-4">Quick Links</h4>
                        <div className="d-flex flex-column">
                            <Link className="text-dark py-2">Nike</Link>
                            <Link className="text-dark py-2">Adidas</Link>
                            <Link className="text-dark py-2">Puma</Link>
                            <Link className="text-dark py-2">Khac</Link>
                        </div>
                    </div> */}
                </div>
            </div>
        </footer>
        <footer className="py-2" style={{ backgroundColor: "#dedfe0"}}>
            <div className="container-xxl">
                <div className="row">
                    <div className="col-12">
                        <p className="text-center text-dark mb-0">&copy; {new Date().getFullYear()}; Bản quyền thuộc về ShoesShop</p>
                    </div>
                </div>
            </div>
        </footer>
    </>
  );
}

export default Footer;