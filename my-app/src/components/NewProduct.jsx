import { useEffect } from "react";
import { getProducts } from "../features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import "../styles/products.css";
import Card from "../components/Card/Card";
import AOS from "aos";
import "aos/dist/aos.css";

function NewProduct() {
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product.products);

  useEffect(() => {
    dispatch(getProducts());
    AOS.init({ duration: 1000 });
  }, [dispatch]);

  // Sort products by createdAt in descending order and take the top 5
  const newestProducts = productState
    ?.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      <h3 className="m-5 text-center fw-bold">Các sản phẩm mới nhất</h3>
      <div className="products" data-aos="fade-up">
        {newestProducts?.length > 0 ? (
          newestProducts.map((item) => (
            <Card key={item.id} product={item} />
          ))
        ) : (
          <h5 className="text-center">Không có sản phẩm mới nhất</h5>
        )}
      </div>
    </div>
  );
}

export default NewProduct;