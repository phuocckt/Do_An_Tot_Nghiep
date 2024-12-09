import { useEffect, useState } from 'react';
import './Card.css';
import { FaHeart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addWishlist } from '../../features/product/productSlice';
import { useFormik } from 'formik';
import { CurrencyFormatter } from "../CurrencyFormatter";

function CardProduct(props) {
  const product = props.product;
  const users = props.users;
  const dispatch = useDispatch();
  const [activeFavorite, setActiveFavorite] = useState(false);
  const [quantity, setQuantity] = useState(0);
  

  // const formik = useFormik({
  //   initialValues: {
  //     prodId: ''
  //   },
  //   onSubmit: values => {
  //     dispatch(addWishlist(values));
  //   },
  // });
  //dem so luot tim
  // const countHearts = (id) => {
  //   let count = 0;
  //   users.forEach(user => {
  //     user.wishlist.forEach(item => {
  //       if (item === id) {
  //         count += 1;
  //       }
  //     });
  //   });
  //   return count;
  // };




  // useEffect(() => {
  //   const newQuantity = countHearts(product._id);
  //   setQuantity(newQuantity);
  // }, [product._id, users]);


  // const handleFavoriteClick = () => {
  //   formik.setFieldValue('prodId', product._id); // Set prodId
  //   formik.handleSubmit(); // Submit form
  //   if(countTemp === quantity && kt) setCountTemp(countTemp-1);
  //   else setCountTemp(countTemp+1)
  // };

  return (
    <div className='card-product'>
      <Link to={`/${product.brand.title.toLowerCase()}/${product._id}`}>
        <img className='card-image' src={product.image[0].url} alt="Ảnh sản phẩm" />
      </Link>

      {/* <form onSubmit={formik.handleSubmit}> */}
      {/* <div name="prodId" value={formik.values.prodId}></div>  */}
      {/* <button type='button' className={activeFavorite ? 'favorite active-favorite' : 'favorite'}>
        <FaHeart className={activeFavorite ? 'text-danger' : ''} /><span>{quantity}</span>
      </button> */}
      {/* </form> */}

      <div className='brand d-flex align-items-center ps-4'>{product.brand.title}</div>

      <div className='card-info'>
        <div className='name truncated-text'>{product.title}</div>
        <div className='d-flex justify-content-between'>
          <h5 className='price mb-3 text-danger'><CurrencyFormatter amount={product.price} /></h5>
          {/* <ul className='star text-warning'>
            <li><FaStar/></li>
            <li><FaStar/></li>
            <li><FaStar/></li>
            <li><FaStar/></li>
            <li><FaStarHalfAlt/></li>
          </ul> */}
        </div>
      </div>
    </div>
  );
}

export default CardProduct;