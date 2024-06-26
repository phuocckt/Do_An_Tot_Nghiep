import { NavLink, Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { CiHeart, CiUser ,CiShoppingCart  } from "react-icons/ci";
import { MdOutlineCategory } from "react-icons/md";
import "./css/Layout.css";
import Dropdown from 'react-bootstrap/Dropdown';

function Header() {
  return (
    <>
        <header className="header-top py-2">
            <div className="container-xxl">
                <div className="row">
                    <div className="col-6">
                        <p className="text-white mb-0">Free Shipping Over 1.000.000đ & Free Returns</p>
                    </div>
                    <div className="col-6">
                        <p className="text-white text-end mb-0">
                            Hotline: <a className="text-white" href="tel: +0123456789">+0123456789</a>
                        </p>
                    </div>
                </div>
            </div>
        </header>
        
        <header className="header-upper py-3">
            <div className="container-xxl">
                <div className="row align-items-center">
                    <div className="col-2">
                        <h2><Link className="text-white" to="/">SHOES SHOP</Link></h2>
                    </div>
                    <div className="col-6">
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search Product Here ..."
                                aria-label="Search Product Here ..."
                                aria-describedby="basic-addon2"
                            />
                            <span className="input-group-text p-3" id="basic-addon2">
                                <IoMdSearch className="fs-5"/>
                            </span>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="header-upper-links d-flex align-items-center justify-content-between">
                            <div>
                                <Link className="d-flex align-items-center gap-10 text-white" to="/products">
                                    <CiHeart className="fs-1"/>
                                    <p className="mb-0">Favorite <br /> Wishlist</p>
                                </Link>
                            </div>
                            <div>
                                <Link className="d-flex align-items-center gap-10 text-white" to="/account">
                                    <CiUser className="fs-1"/>
                                    <p className="mb-0">Login <br /> My Account</p>
                                </Link>
                            </div>
                            <div>
                                <Link className="d-flex align-items-center gap-10 text-white" to="/cart">
                                    <CiShoppingCart className="fs-1" />
                                    <div className="d-flex flex-column">
                                        <span className="badge bg-white text-dark">2</span>
                                        <p className="mb-0">$ 500</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <header className="header-bottom py-2">
            <div className="container-xxl">
                <div className="col-12">
                    <div className="menu-bottom d-flex align-items-center gap-30">
                        <div>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="d-flex align-items-center gap-10">
                                <MdOutlineCategory className="fs-4"/>
                                <span>Shop Categories</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="/products">All Products</Dropdown.Item>
                                <Dropdown.Item href="#/action-1">Nike</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Adidas</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Puma</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Bitis</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        </div>
                        <div className="menu-links">
                            <div className="d-flex align-items-center gap-15">
                                <NavLink className="actived" to="/">Home</NavLink>
                                <NavLink to="/">Our Store</NavLink>
                                <NavLink to="#blogs">Blogs</NavLink>
                                <NavLink to="/">Contact</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </>
  );
}

export default Header;