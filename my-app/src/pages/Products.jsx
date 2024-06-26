import "./css/Products.css";
import Card from '../components/Card/Card';
import { Dropdown } from "react-bootstrap";
import { FaSortAmountUp, FaSortAmountDown} from "react-icons/fa";
import { getProducts} from '../features/product/productSlice';
import { getBrands} from '../features/brand/brandSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { SiNike, SiAdidas, SiJordan } from "react-icons/si";

function Products() {
    const productState = useSelector((state) => state.product.products);
    const brandState = useSelector((state) => state.brand.brands);
  
    const [sortProducts, setSortProducts] = useState([]);
    const [brandCurrent, setBrandCurrent] = useState("all");
    const [activeButton, setActiveButton] = useState(null);
    
  const dispatch = useDispatch();  
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getBrands());
  }, [dispatch]);
  useEffect(() => {
    setSortProducts(productState)
  },[productState])
//   hien icon theo brand
const iconMap = {
    Nike: SiNike,
    Adidas: SiAdidas,
    Jordan: SiJordan
};
const Icon = ({ iconName }) => {
    const IconComponent = iconMap[iconName];
    return (
      <>
        {IconComponent ? <IconComponent className="me-2"/> : <></>}
      </>
    );
  };
// search theo ten
const handleChangeSearch = (e) =>{
    
    setQuery(e.target.value)
    filterSearch(e.target.value);
}
const filterSearch = (searchTerm) =>{
    const filtered = sortProducts.filter((brand) =>
        brand.title && brand.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSortProducts(filtered);
}
const updateData = () =>{
    setActiveButton(null)
    setSortProducts(productState)
    setBrandCurrent("all")
  }
  //sap xep theo brand
  const sortBrand = (name) =>{
     setQuery('')
    if(query !== '')
        setActiveButton(null)
   
    setActiveButton(name)
    setBrandCurrent(name)
    if(name === "all"){
        setSortProducts(productState)
    }
    else{
        let brand = productState.filter(item => {
            return item.brand.title === name;
        })
        setSortProducts(brand)
    } 
  }
  // sap xep theo brand va price giam dan
  const sortUptoDown = () =>{
    setQuery('')
    let product = sortProducts.filter(item => {
        if(brandCurrent === "all")
            return true
        return item.brand.title === brandCurrent;
    })
    setSortProducts(product.sort((a,b) => a.price < b.price ? 1 : -1))
  }
  //sap xep theo brand va price tang dan
  const sortDowntoUp = () =>{
    setQuery('')
    let product = sortProducts.filter(item => {
        if(brandCurrent === "all")
            return true
        return item.brand.title === brandCurrent;
    })
    setSortProducts(product.sort((a,b) => a.price > b.price ? 1 : -1))
  }

  return (
    <>
        <div className="filters">
            <div className="brand d-flex">
                <button onClick={() => sortBrand("all")} className={activeButton === 'all' ? "active-button" : ""}>All Product</button>
                {
                    brandState.map(item => {
                        return(
                            <button onClick={() => sortBrand(item.title)} className={activeButton === item.title ? "active-button" : ""}><Icon iconName={item.title}/>{item.title}</button>
                        )
                    })
                }

            </div>
            <div className="d-flex">
                <input onChange={handleChangeSearch} value={query} onFocus={updateData} className="search" type="text" placeholder="Search Product Here ..."/>
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="sortby">
                        Sort By
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="sortby-items">
                        <Dropdown.Item onClick={() => sortUptoDown()} className="sortby-item ms-2">Price<FaSortAmountDown className="ms-2"/></Dropdown.Item>
                        <Dropdown.Item onClick={() => sortDowntoUp()} className="sortby-item ms-2">Price<FaSortAmountUp className="ms-2"/></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            
        </div>

        <div className="products">
            {sortProducts?.length > 0 ? (
            sortProducts.map(item => (
                <Card product={item} />
            ))
            ) : (
                <img className="no-data" src="../hinh/nodata.png" alt="no data" />
            )}
        </div>
        
    </>
  );
}

export default Products;