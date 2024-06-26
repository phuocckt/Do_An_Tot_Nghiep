import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import { FaStar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

function RowColLayoutColWidthBreakpointExample() {
  return (
    <>
        <Container className="my-5">
          <Row md={2}>
            <Col className='d-flex'>
              <div>
                <img className='border mb-2' style={{width:'100px'}} src="../hinh/bg-nav.png"/>
                <img className='border mb-2' style={{width:'100px'}} src="../hinh/bg-nav.png"/>
                <img className='border mb-2' style={{width:'100px'}} src="../hinh/bg-nav.png"/>
                <img className='border mb-2' style={{width:'100px'}} src="../hinh/bg-nav.png"/>
                <img className='border mb-2' style={{width:'100px'}} src="../hinh/bg-nav.png"/>
              </div>
              <img className='border' style={{width:'500px', objectFit: 'cover'}} src="../hinh/bg-nav.png"/>
            </Col>

            <Col className='ps-5'>
              <h1 className='mb-2'>Nike Retro Remeum</h1>
              <div className='d-flex align-items-center'>
                <h4 className='text-danger me-3'>$9.999</h4>
                <h5 className='text-decoration-line-through'>$99.999</h5>
              </div>
              <p className='px-4 my-4'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente iusto provident excepturi placeat optio itaque magnam sed sint dolor debitis tenetur ipsam totam et, sunt minima ex aliquam vero nemo.</p>
              <div className='d-flex align-items-center text-warning'>
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <span className='ms-2 fw-bold fs-5'>5</span>
              </div>
              <div className='my-3'>
                Color: <span className='fw-bold'>Red</span>
                <div className='my-2'>
                  <span className='bg-danger me-3 rounded p-2 text-light'>Red</span>
                  <span className='bg-warning me-3 rounded p-2 text-light'>Yellow</span>
                  <span className='bg-success  me-3 rounded p-2 text-light'>Green</span>
                  <span className='bg-dark me-3 rounded p-2 text-light'>Black</span>
                </div>
              </div>
              <div className='my-3'>
                Size: <span className='fw-bold'>XL</span>
                <div className='my-4'>
                  <span className='border p-3 fw-bold me-2'>S</span>
                  <span className='border p-3 fw-bold me-2'>M</span>
                  <span className='border p-3 fw-bold me-2'>L</span>
                  <span className='border p-3 fw-bold border-3 border-success me-2'>XL</span>
                </div>
              </div>
              <div className='my-5'>
                <a className='rounded-pill btn btn-primary me-3'><i class="fa-solid fa-cart-shopping me-2"></i>ADD TO CART</a>
                <Button className='rounded-circle me-2' variant="danger"><FaHeart /></Button>
              </div>
            </Col>
          </Row>
        </Container>
    </>
  );
}

export default RowColLayoutColWidthBreakpointExample;