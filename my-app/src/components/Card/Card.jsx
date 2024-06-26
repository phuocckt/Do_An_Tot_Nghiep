import { useState } from 'react';
import './Card.css';
import { FaHeart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { SiNike } from "react-icons/si";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addWishlist } from '../../features/product/productSlice';
import { useFormik } from 'formik';

function CardProduct(props) {
  const product = props.product;
  const user = props.users;
  const dispatch = useDispatch();
  const [activeFavorite, setActiveFavorite] = useState(false);

  const formik = useFormik({
    initialValues: {
      prodId: ''
    },
    onSubmit: values => {
      dispatch(addWishlist(values));
      setActiveFavorite(!activeFavorite);
    },
  });

  // Định dạng số tiền theo định dạng tiền tệ Việt Nam
  const CurrencyFormatter = ({ amount }) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });

    return <span>{formatter.format(amount)}</span>;
  };

  const handleFavoriteClick = () => {
    formik.setFieldValue('prodId', product._id); // Set prodId
    formik.handleSubmit(); // Submit form
  };

  return (
    <div className='card-product'>
      <Link to={`/product/${product._id}`}>
        <img className='card-image' src={product.image[0].url} alt="Ảnh sản phẩm"/>
      </Link>

      <form onSubmit={formik.handleSubmit}>
        <div name="prodId" value={formik.values.prodId}></div> 
        <button type='button' onClick={handleFavoriteClick} className={activeFavorite ? 'favorite active-favorite' : 'favorite'}>
          <FaHeart className={activeFavorite ? 'text-danger' : ''}/>
        </button>
      </form>

      <div className='brand d-flex align-items-center'><SiNike className='me-1'/>{product.brand.title}</div>

      <div className='card-info'>
        <div className='name truncated-text'>{product.title}</div>
        <div className='d-flex justify-content-between'>
          <h5 className='price'><CurrencyFormatter amount={product.price}/></h5>
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