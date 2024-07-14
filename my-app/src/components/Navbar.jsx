import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { CiShoppingCart } from "react-icons/ci";
import Headroom from "react-headroom";
import "./css/Layout.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userNone from "../assets/images/user-none.jpg";
import { IoCart } from "react-icons/io5";
import { getCart } from "../features/auth/authSlice";
import { useEffect } from "react";

function Header() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.auth.carts);
  const userId = user?._id;

  // useEffect(() => {
  //   dispatch(getCart());
  // }, []);

  return (
    <Headroom>
      <Navbar
        collapseOnSelect
        expand="lg"
        style={{ backgroundColor: "#111126", fontWeight: "bold" }}
      >
        <Container>
          <Navbar.Brand href="/" className="text-light">
            SHOES SHOP
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="align-items-center">
              <Link className="text-light nav-link-spacing" to="/">
                TRANG CHỦ
              </Link>
              <Link className="text-light nav-link-spacing" to="/products">
                SẢN PHẨM
              </Link>
              {/* {userId == null || user == null ? (
                <Link className="text-light nav-link-spacing position-relative" to="/login">
                  <CiShoppingCart className="fs-1" />
                  <span className="quantity-cart">
                    {cart && cart.products?.length > 0 ? cart.products?.length : "00"}
                  </span>
                </Link>
              ) : ( */}
                <Link className="text-light nav-link-spacing position-relative" to="/cart">
                  {/* <CiShoppingCart className="fs-1" /> */}
                  <IoCart className="fs-3"/>
                  {/* <span className="quantity-cart">
                    {cart && cart.products?.length > 0 ? cart.products?.length : "00"}
                  </span> */}
                </Link>
              {/* )} */}
              {userId == null || user == null ? (
                <Link className="text-light nav-link-spacing" to="/login">
                  ĐĂNG NHẬP
                </Link>
              ) : (
                <Link
                  className="text-light d-flex align-items-center nav-link-spacing"
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
                    {user !== null ? (
                      user.images[0] ? (
                        <img
                          src={user.images[0]?.url}
                          alt="avatar"
                          className="w-100"
                        />
                      ) : (
                        <img src={userNone} alt="avatar" className="w-100" />
                      )
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
