import "../styles/products.css";
import Card from "../components/Card/Card";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProducts } from "../features/product/productSlice";
import { getBrands } from "../features/brand/brandSlice";
import { getSizes } from "../features/size/sizeSlice";

function Products(props) {
  const productState = useSelector((state) => state.product.products || []);
  const brandState = useSelector((state) => state.brand.brands || []);
  const sizeState = useSelector((state) => state.size.sizes || []);
  const [sortProducts, setSortProducts] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    priceRange: "",
    sizes: [],
  });

  const priceRanges = [
    { label: "Dưới 1 triệu", min: 0, max: 1000000 },
    { label: "1 triệu - 2 triệu", min: 1000000, max: 2000000 },
    { label: "2 triệu - 3 triệu", min: 2000000, max: 3000000 },
    { label: "3 triệu - 4 triệu", min: 3000000, max: 4000000 },
    { label: "Trên 4 triệu", min: 4000000, max: Infinity },
  ];

  const brandTitle = props.props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getBrands());
    dispatch(getSizes());
  }, [dispatch]);

  useEffect(() => {
    applyFilters();
  }, [productState, brandTitle, searchCriteria]);

  const applyFilters = () => {
    if (Array.isArray(productState) && productState.length > 0) {
      const filteredProducts = productState.filter((product) => {
        const matchesBrand = product.brand?.title === brandTitle;

        const matchesPrice =
          !searchCriteria.priceRange ||
          (product.price >= searchCriteria.priceRange.min &&
            product.price <= searchCriteria.priceRange.max);

        const matchesSizes =
          searchCriteria.sizes.length === 0 ||
          searchCriteria.sizes.some((size) => product.variants?.some((variant) => variant.size.title === size));

        return matchesBrand && matchesPrice && matchesSizes;
      });
      setSortProducts(filteredProducts);
    }
  };

  const handlePriceRangeChange = (e) => {
    const selectedRange = priceRanges.find(
      (range) => range.label === e.target.value
    );
    setSearchCriteria((prev) => ({
      ...prev,
      priceRange: selectedRange || "",
    }));
  };

  const handleSizeChange = (size) => {
    setSearchCriteria((prev) => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    <div className="products-page">
      {/* Filters Section */}
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

        <div className="advanced-filters">
          {/* Price Range */}
          <div className="price-filters">
            <label>Khoảng giá:</label>
            <select
              name="priceRange"
              value={searchCriteria.priceRange?.label || ""}
              onChange={handlePriceRangeChange}
            >
              <option value="">Chọn khoảng giá</option>
              {priceRanges.map((range) => (
                <option key={range.label} value={range.label}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sizes */}
          <div className="size-filters">
            <label>Kích cỡ:</label>
            <div className="size-checkbox-group">
              {sizeState.map((size) => (
                <div key={size} className="size-checkbox">
                  <input
                    type="checkbox"
                    id={`size-${size.title}`}
                    checked={searchCriteria.sizes.includes(size.title)}
                    onChange={() => handleSizeChange(size.title)}
                  />
                  <label htmlFor={`size-${size.title}`}>{size.title}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products">
        {sortProducts?.length > 0 ? (
          sortProducts.map((item) => (
            <Card key={item.id} product={item} brand={brandTitle} />
          ))
        ) : (
          <h1>Không tìm thấy sản phẩm</h1>
        )}
      </div>
    </div>
  );
}

export default Products;
