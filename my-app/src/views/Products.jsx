import "../styles/products.css";
import Card from "../components/Card/Card";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProducts } from "../features/product/productSlice";
import { getBrands } from "../features/brand/brandSlice";
import { useParams } from "react-router-dom";

function Products(props) {
  const productState = useSelector((state) => state.product.products || []); // Giá trị mặc định là []
  const [sortProducts, setSortProducts] = useState([]);
  const brandTitle = props.props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getBrands()); 
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(productState) && productState.length > 0) {
      const filteredProducts = productState.filter(
        (product) => product.brand?.title === brandTitle // Kiểm tra kỹ dữ liệu
      );
      setSortProducts(filteredProducts);
    }
  }, [productState, brandTitle]);

  const sortUptoDown = () => {
    setSortProducts((prevProducts) =>
      [...prevProducts].sort((a, b) => b.price - a.price)
    );
  };

  const sortDowntoUp = () => {
    setSortProducts((prevProducts) =>
      [...prevProducts].sort((a, b) => a.price - b.price)
    );
  };

  return (
    <>
      <div className="filters">
        <div className="d-flex">
          <Dropdown>
            <Dropdown.Toggle
              variant="light"
              id="dropdown-basic"
              className="sortby"
            >
              Sắp xếp theo
            </Dropdown.Toggle>
            <Dropdown.Menu className="sortby-items">
              <Dropdown.Item onClick={sortUptoDown} className="sortby-item">
                Giá giảm dần
              </Dropdown.Item>
              <Dropdown.Item onClick={sortDowntoUp} className="sortby-item">
                Giá tăng dần
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <div className="products">
        {sortProducts?.length > 0 ? (
          sortProducts.map((item) => (
            <Card key={item.id} product={item} brand={brandTitle} />
          ))
        ) : (
          <h1>Không tìm thấy sản phẩm</h1>
        )}
      </div>
    </>
  );
}

export default Products;
