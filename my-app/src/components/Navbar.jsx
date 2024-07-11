import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { CiShoppingCart } from "react-icons/ci";
import Headroom from "react-headroom";
import "./css/Layout.css";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userNone from "../assets/images/user-none.jpg";
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
              <Nav.Link className="text-light" href="/">
                TRANG CHỦ
              </Nav.Link>
              <Nav.Link className="text-light" href="/products">
                SẢN PHẨM
              </Nav.Link>
              <Nav.Link className="text-light position-relative" href="/cart">
                <CiShoppingCart className="fs-1" />
                <span className="quantity-cart">
                  {cart && cart.products?.length > 0 ? cart.products?.length : "00"}
                </span>
              </Nav.Link>
              {userId == null || user == null ? (
                <Link className="text-light" to="/login">
                  ĐĂNG NHẬP
                </Link>
              ) : (
                <NavLink
                  className="text-light d-flex align-items-center"
                  to={"/account"}
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
                </NavLink>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Headroom>
  );
}

export default Header;
