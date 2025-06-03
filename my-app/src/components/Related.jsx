import { useEffect } from "react";
import { getProducts } from "../features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import "../styles/products.css";
import Card from "../components/Card/Card";
import AOS from "aos";
import "aos/dist/aos.css";

function Related({ currentBrand, currentProductId }) {
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product.products);

  useEffect(() => {
    dispatch(getProducts());
    AOS.init({ duration: 1000 });
  }, [dispatch]);

  // Filter products by the same brand but exclude the current product
  const relatedProducts = productState?.filter(
    (product) => 
      product.brand?.title === currentBrand && product._id !== currentProductId
  );

  return (
    <div>
      <h3 className="m-5 text-center fw-bold">Các sản phẩm liên quan</h3>
      <div className="products" data-aos="fade-up">
        {relatedProducts?.length > 0 ? (
          relatedProducts.slice(-5).map((item) => (
            <Card key={item.id} product={item} />
          ))
        ) : (
          <h5 className="text-center">Không có sản phẩm liên quan</h5>
        )}
      </div>
    </div>
  );
}

export default Related;
