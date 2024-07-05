import "./css/Products.css";
import Card from '../components/Card/Card';
import { Dropdown } from "react-bootstrap";
import { FaSortAmountUp, FaSortAmountDown, FaStar, FaStarHalfAlt, FaHeart} from "react-icons/fa";
import { addWishlist, getProducts} from '../features/product/productSlice';
import { getBrands} from '../features/brand/brandSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { getUsers } from "../features/customer/customerSlice";
import { CurrencyFormatter } from "../components/CurrencyFormatter";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import './css/Cart.css'

function Products() {
    const productState = useSelector((state) => state.product.products);
    const brandState = useSelector((state) => state.brand.brands);
    const userState = useSelector((state) => state.customer.customers);
  
    const [sortProducts, setSortProducts] = useState([]);
    const [brandCurrent, setBrandCurrent] = useState("all");
    const [activeButton, setActiveButton] = useState(null);
    const [query, setQuery] = useState('');
    const [activeFavorite, setActiveFavorite] = useState(false);
    const [quantity, setQuantity] = useState(0);

    const dispatch = useDispatch();  

    // const formik = useFormik({
    //     initialValues: {
    //       prodId: ''
    //     },
    //     onSubmit: values => {
    //       dispatch(addWishlist(values));
    //     },
    //   });
      //dem so luot tim
    //   const countHearts = (id) => {
    //     let count = 0;
    //     userState.forEach(user => {
    //       user.wishlist.forEach(item => {
    //         if (item === id) {
    //           count += 1;
    //         }
    //       });
    //     });
    //     setQuantity(count);
    //   };
      
    
    //   const handleFavoriteClick = () => {
    //     formik.setFieldValue('prodId', productState._id); // Set prodId
    //     formik.handleSubmit(); // Submit form
    //   };
  

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getBrands());
    dispatch(getUsers())
  }, [dispatch]);
  useEffect(() => {
    setSortProducts(productState)
  },[productState])
//   useEffect(() => {
//     const newQuantity = countHearts(productState._id);
//     setQuantity(newQuantity);
//     // countHearts(product._id);
//   }, [productState._id, userState, quantity]);
  
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
                <button onClick={() => sortBrand("all")} className={activeButton === 'all' ? "active-button" : ""}>Tất cả</button>
                {
                    brandState.map(item => {
                        return(
                            <button onClick={() => sortBrand(item.title)} className={activeButton === item.title ? "active-button" : ""}>{item.title}</button>
                        )
                    })
                }

            </div>
            <div className="d-flex">
                <input onChange={handleChangeSearch} value={query} onFocus={updateData} className="search" type="text" placeholder="Tìm kiếm tại đây ..."/>
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="sortby">
                        Sắp xếp theo
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="sortby-items">
                        <Dropdown.Item onClick={() => sortUptoDown()} className="sortby-item">Giá giảm dần</Dropdown.Item>
                        <Dropdown.Item onClick={() => sortDowntoUp()} className="sortby-item">Giá tăng dần</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            
        </div>

        <div className="products">
            {sortProducts?.length > 0 ? (
            sortProducts.map(item => (
                <Card product={item} users={userState}/>
            ))
            ) : (
                <img className="no-data" src="../hinh/nodata.png" alt="no data" />
            )}
        </div>
        
    </>
  );
}

export default Products;