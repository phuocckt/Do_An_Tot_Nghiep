import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Headroom from 'react-headroom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { IoMdSearch } from "react-icons/io";
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { InputGroup } from 'react-bootstrap';

function CollapsibleExample() {
  return (
    <>
    <Headroom>
    <Navbar collapseOnSelect expand="lg" className='bg-light' >
      <Container>
        <Navbar.Brand href="#home">Name shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className='bg-light'/>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="m-auto">
            <Nav.Link href="#features">Home</Nav.Link>
            <Nav.Link href="#pricing">About</Nav.Link>
            <NavDropdown title="Pages" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="products">Products</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#pricing">Contact Us</Nav.Link>
          </Nav>

          

          <Nav>
          <Nav.Link href="#pricing">
              <InputGroup size='sm'>
              <Button className='bg-secondary border-0'><IoMdSearch size={"1.5em"}/></Button>
              <Form.Control size="sm" type="text" placeholder="Search"/>
              </InputGroup> 
            </Nav.Link>
            <Nav.Link href="#deets"><FaHeart size={"1.5em"}/></Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
            <FaShoppingCart size={"1.5em"}/>
            </Nav.Link>
            <NavDropdown title={<FaUser size={"1.5em"}/>} id="collapsible-nav-dropdown">
              <NavDropdown.Item href="products">Sign in</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Setting
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </Headroom>    </>
  );
}

export default CollapsibleExample;