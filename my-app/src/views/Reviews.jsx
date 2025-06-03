import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../features/product/productSlice";
import Comment from "../components/Comment/Comment";
import "../styles/review.css";
import { CurrencyFormatter } from "../components/CurrencyFormatter";

function Reviews() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const fetchProduct = useCallback(() => {
    if (id) {
      dispatch(getProduct(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);
  const productState = useSelector((state) => state.product.product);

  return (
    <>
      {productState ? (
        <>
          <div className="product-container">
            <h2 className="product-title">Đánh giá {productState.title}</h2>
            <div className="product-card">
              <Link to={`/${productState.brand.title.toLowerCase()}/${productState.slug}`}>
                <img
                  src={productState.image[0].url} // Link ảnh của sản phẩm
                  alt={productState.title}
                  className="product-image"
                />
              </Link>
              <div className="product-details">
                <h3 className="product-name">{productState.title}</h3>
                <p className="product-price">
                  <span className="product-price-sale"><CurrencyFormatter amount={productState.price} /></span>
                </p>
                <button className="buy-now-button">Thêm vào giỏ hàng</button>
              </div>
            </div>
          </div>
          <Comment product={productState} />
        </>
      ) : (
        <p>Đang tải đánh giá...</p>
      )}
    </>
  )
}

export default Reviews;
