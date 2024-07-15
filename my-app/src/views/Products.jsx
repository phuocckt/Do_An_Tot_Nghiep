import "../styles/products.css";
import Card from "../components/Card/Card";
import { Dropdown } from "react-bootstrap";
import { FaChevronDown } from "react-icons/fa";
import { addWishlist, getProducts } from "../features/product/productSlice";
import { getBrands } from "../features/brand/brandSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUsers } from "../features/customer/customerSlice";
import { CurrencyFormatter } from "../components/CurrencyFormatter";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import "../styles/cart.css";

function Products() {
  const productState = useSelector((state) => state.product.products);
  const brandState = useSelector((state) => state.brand.brands);
  const userState = useSelector((state) => state.customer.customers);

  const [sortProducts, setSortProducts] = useState([]);
  const [brandCurrent, setBrandCurrent] = useState("all");
  const [activeButton, setActiveButton] = useState(null);
  const [query, setQuery] = useState("");
  const [activeFavorite, setActiveFavorite] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchName, setSearchName] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getBrands());
    dispatch(getUsers());
  }, [dispatch]);
  useEffect(() => {
    setSortProducts(productState);
  }, [productState]);
  // xem them
  const showMoreItems = () => {
    setVisibleCount((prev) => prev + 12);
  };
  // search theo ten
  const handleChangeSearch = (e) => {
    setQuery(e.target.value);
    filterSearch(e.target.value);
  };
  const filterSearch = (searchTerm) => {
    const filtered = sortProducts.filter(
      (brand) =>
        brand.title &&
        brand.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSortProducts(filtered);
  };
  const updateData = () => {
    setActiveButton(null);
    setSortProducts(productState);
    setBrandCurrent("all");
  };
  //sap xep theo brand
  const sortBrand = (name) => {
    setQuery("");
    if (query !== "") setActiveButton(null);

    setActiveButton(name);
    setBrandCurrent(name);
    if (name === "all") {
      setSortProducts(productState);
    } else {
      let brand = productState.filter((item) => {
        return item.brand.title === name;
      });
      setSortProducts(brand);
    }
  };
  // sap xep theo brand va price giam dan
  const sortUptoDown = () => {
    setQuery("");
    let product = sortProducts.filter((item) => {
      if (brandCurrent === "all") return true;
      return item.brand.title === brandCurrent;
    });
    setSortProducts(product.sort((a, b) => (a.price < b.price ? 1 : -1)));
  };
  //sap xep theo brand va price tang dan
  const sortDowntoUp = () => {
    setQuery("");
    let product = sortProducts.filter((item) => {
      if (brandCurrent === "all") return true;
      return item.brand.title === brandCurrent;
    });
    setSortProducts(product.sort((a, b) => (a.price > b.price ? 1 : -1)));
  };
  const filteredProducts = () => {
    return productState.filter(product => {
      if (searchName && !product.title.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  return (
    <>
      <div className="filters">
        <div className="brand d-flex">
          <button
            onClick={() => sortBrand("all")}
            className={activeButton === "all" ? "active-button" : ""}
          >
            Tất cả
          </button>
          {brandState.map((item) => {
            return (
              <button
                onClick={() => sortBrand(item.title)}
                className={activeButton === item.title ? "active-button" : ""}
              >
                {item.title}
              </button>
            );
          })}
        </div>
        <div className="d-flex">
          <input
            onChange={handleChangeSearch}
            value={query}
            onFocus={updateData}
            className="search"
            type="text"
            placeholder="Tìm kiếm tại đây ..."
          />
          <Dropdown>
            <Dropdown.Toggle
              variant="light"
              id="dropdown-basic"
              className="sortby"
            >
              Sắp xếp theo
            </Dropdown.Toggle>

            <Dropdown.Menu className="sortby-items">
              <Dropdown.Item
                onClick={() => sortUptoDown()}
                className="sortby-item"
              >
                Giá giảm dần
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => sortDowntoUp()}
                className="sortby-item"
              >
                Giá tăng dần
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <div className="products">
      {sortProducts?.length > 0 ? (
        <>
          {sortProducts.slice(0, visibleCount).map((item) => (
            <Card key={item.id} product={item} users={userState} />
          ))}
          {visibleCount < sortProducts.length && (
            <button className="seemore" onClick={showMoreItems}>Xem thêm<FaChevronDown className="icon-down"/></button>
          )}
        </>
      ) : (
        <img className="no-data" src="../hinh/nodata.png" alt="no data" />
      )}
    </div>
    </>
  );
}

export default Products;
