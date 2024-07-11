import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from '../components/Card/Card';
import { MdFiberNew } from "react-icons/md";
import { IoIosFlash } from "react-icons/io";
import "../styles/products.css";

function AutoLayoutExample() {
  return (
    <Container className='my-5'>

      <h3 className='mb-2'><MdFiberNew className='me-2 blink'/>New Products</h3>
      <Row className='mb-5'>
        <Col className='m-auto mb-4'><Card/></Col>
        <Col className='m-auto mb-4'><Card/></Col>
        <Col className='m-auto mb-4'><Card/></Col>
      </Row>
      
    </Container>
  );
}

export default AutoLayoutExample;