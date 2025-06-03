import './Card.css';
import { Link } from 'react-router-dom';
import { CurrencyFormatter } from "../CurrencyFormatter";

function CardProduct(props) {
  const product = props.product;

  return (
    <div className='card-product'>
      <Link to={`/${product.brand.title.toLowerCase()}/${product.slug}`}>
        <img className='card-image' src={product.image[0].url} alt="Ảnh sản phẩm" />
      </Link>
      <div className='brand d-flex align-items-center ps-4'>{product.brand.title}</div>

      <div className='card-info'>
        <div className='name truncated-text'>{product.title}</div>
        <div className='d-flex justify-content-between'>
          <h5 className='price mb-3 text-danger'><CurrencyFormatter amount={product.price} /></h5>
        </div>
      </div>
    </div>
  );
}

export default CardProduct;