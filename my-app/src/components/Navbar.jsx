import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { CiShoppingCart, CiUser } from "react-icons/ci";
import Headroom from 'react-headroom';
import './css/Layout.css'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function Header() {
  const navigate = useNavigate();
  const user = useSelector( state => state.auth.user);
  const cart = useSelector( state => state.auth.carts);
  const userId = user?._id;

  return (
    <Headroom>
      <Navbar collapseOnSelect expand="lg" style={{backgroundColor: '#111126',fontWeight:'bold'}}>
        <Container>
          <Navbar.Brand href="/" className='text-light'>SHOES SHOP</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className='justify-content-end'>
            
            <Nav className='align-items-center'>
              <Nav.Link className='text-light' href="/">TRANG CHỦ</Nav.Link>
              <Nav.Link className='text-light' href="/products">SẢN PHẨM</Nav.Link>
              <Nav.Link className='text-light position-relative' href="/cart">
                <CiShoppingCart className='fs-1'/>
                <span className='quantity-cart'></span>
              </Nav.Link>
              <Nav.Link>
                {
                    userId == null || user == null?(
                      <Link className='text-light' to='/login'>ĐĂNG NHẬP</Link>
                    ):(
                      <Link className='text-light d-flex align-items-center' to='/account'>
                        <CiUser className='fs-2'/>
                        <span>{user.lastname}</span>
                      </Link>
                    )
                }
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Headroom>
    
  );
}

export default Header;