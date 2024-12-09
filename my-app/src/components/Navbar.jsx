import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { IoCart } from "react-icons/io5";
import Headroom from "react-headroom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import userNone from "../assets/images/user-none.jpg";
import Logo from "../assets/images/Logo.png";
import { Image, Dropdown } from "react-bootstrap";
import "./css/Layout.css";

function Header() {
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.auth.carts);
  const brandState = useSelector((state) => state.brand.brands); // Lấy danh sách danh mục
  const userId = user?._id;

  return (
    <Headroom>
      <Navbar
        collapseOnSelect
        expand="lg"
        style={{ backgroundColor: "#dedfe0", fontWeight: "bold" }}
      >
        <Container>
          <Navbar.Brand href="/" className="text-dark">
            <Image src={Logo} alt="ShoesShop" width={145} height={94} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="align-items-center">
              <Link
                className="text-dark nav-link-spacing"
                style={{ fontSize: "20px" }}
                to="/gioi-thieu"
              >
                GIỚI THIỆU
              </Link>

              {/* Menu Sản Phẩm với Dropdown */}
              <Dropdown className="dropdown">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-basic"
                  className="text-dark nav-link-spacing"
                  style={{
                    fontSize: "20px", // Đảm bảo rằng kích thước chữ khớp với các menu khác
                    fontWeight: "bold", // Kiểu chữ giống nhau
                  }}
                >
                  SẢN PHẨM
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {brandState.map((brand) => (
                    <Dropdown.Item
                      key={brand._id} // Thêm khóa để tránh lỗi khi map qua
                      as={Link}
                      to={`/${brand.title.toLowerCase()}`}
                      style={{
                        fontSize: "20px", // Kích thước chữ
                        fontWeight: "bold", // Kiểu chữ đậm
                      }}
                    >
                      {brand.title}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Link
                className="text-dark nav-link-spacing"
                style={{ fontSize: "20px" }}
                to="/tin-tuc"
              >
                TIN TỨC
              </Link>
              <Link
                className="text-dark nav-link-spacing"
                style={{ fontSize: "20px" }}
                to="/lien-he"
              >
                LIÊN HỆ
              </Link>
              <Link
                className="text-dark nav-link-spacing position-relative"
                to="/cart"
              >
                <IoCart className="fs-3" />
              </Link>

              {userId == null || user == null ? (
                <Link
                  className="text-dark nav-link-spacing"
                  style={{ fontSize: "20px" }}
                  to="/login"
                >
                  ĐĂNG NHẬP
                </Link>
              ) : (
                <Link
                  className="text-dark d-flex align-items-center nav-link-spacing"
                  style={{ fontSize: "20px" }}
                  to="/account"
                >
                  <div
                    className="nav-avatar me-1"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  >
                    {user?.images?.[0] ? (
                      <img
                        src={user.images[0]?.url}
                        alt="avatar"
                        className="w-100"
                      />
                    ) : (
                      <img src={userNone} alt="avatar" className="w-100" />
                    )}
                  </div>
                  <span>{user.lastname}</span>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Headroom>
  );
}

export default Header;
