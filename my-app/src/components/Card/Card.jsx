import { useState } from 'react';
import './Card.css';
import { FaHeart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { SiNike } from "react-icons/si";
import { Link } from 'react-router-dom';
import Product from '../../pages/Product';



function CardProduct(props) {
  const product = props.product;
  const [activeFavorite, setActiveFavorite] = useState(false);

  const handleClick = () => {
    setActiveFavorite(!activeFavorite);
  }
  // Định dạng số tiền theo định dạng tiền tệ Việt Nam
  const CurrencyFormatter = ({ amount }) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  
    return <span>{formatter.format(amount)}</span>;
  };

  return (
    <div className='card-product'>
      <Link to={`/product/${product._id}`}>
        <img className='card-image' src={product.image[0].url} alt="Ảnh sản phẩm"/>
      </Link>

      <div className={activeFavorite ? 'favorite active-favorite' : 'favorite'} onClick={handleClick}><FaHeart className={activeFavorite ? 'text-danger' : ''}/>22</div> 

      <div className='brand d-flex align-items-center'><SiNike className='me-1'/>{product.brand.title}</div>

      <div className='card-info'>
        <div className='name truncated-text'>{product.title}</div>
        <div className='d-flex justify-content-between'>
          <h5 className='price'><CurrencyFormatter amount={product.price}/></h5>
          {/* <h6 className='pb-3'>{props.product.priceOld}</h6> */}
          <ul className='star text-warning'>
            <li><FaStar/></li>
            <li><FaStar/></li>
            <li><FaStar/></li>
            <li><FaStar/></li>
            <li><FaStarHalfAlt/></li>
          </ul>
        </div> 
      </div>
    </div>
  );
}

export default CardProduct;