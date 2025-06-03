import { useEffect } from "react";
import { getProducts } from "../features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import "../styles/products.css";
import Card from "../components/Card/Card";
import AOS from "aos";
import "aos/dist/aos.css";

function AutoLayoutExample() {
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product.products);

  useEffect(() => {
    dispatch(getProducts());
    AOS.init({ duration: 1000 });
  }, [dispatch]);

  // Sort products by sold in descending order and take the top 5
  const topSellingProducts = productState
    ?.slice()
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  return (
    <div>
      <h3 className="m-5 text-center fw-bold">Các sản phẩm bán chạy</h3>
      <div className="products" data-aos="fade-up">
        {topSellingProducts?.length > 0 ? (
          topSellingProducts.map((item) => (
            <Card key={item.id} product={item} />
          ))
        ) : (
          <h5 className="text-center">Không có sản phẩm bán chạy</h5>
        )}
      </div>
    </div>
  );
}

export default AutoLayoutExample;
