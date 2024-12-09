import { useEffect } from "react";
import { getProducts } from "../features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import "../styles/products.css";
import Card from "../components/Card/Card";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

function AutoLayoutExample() {
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product.products);
  const userState = useSelector((state) => state.customer.customers);

  useEffect(() => {
    dispatch(getProducts());
    AOS.init({ duration: 1000 });
  }, [dispatch]);

  return (
    <div>
      <h3 className="m-5 text-center fw-bold">Các sản phẩm mới nhất</h3>
      <div className="products" data-aos="fade-up">
        {productState?.length > 0 &&
          productState
            .slice(productState?.length-4, productState?.length)
            .map((item) => (
              <Card  key={item.id} product={item} users={userState} />
            ))}
      </div>
    </div>
  );
}

export default AutoLayoutExample;
