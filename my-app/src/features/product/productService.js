import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const getProducts = async () => {
    const res = await axios.get(`${base_url}products/all-products`);
    return res.data;
}
const getProduct = async (id) => {
    const res = await axios.get(`${base_url}products/${id}`);
    return res.data;
}
const addWishlist = async (data) => {
    const res = await axios.put(`${base_url}products/wishlist`, data, config);
    return res.data;
}

const rating = async (data) => {
    const res = await axios.put(`${base_url}products/rating`, data, config);
    return res.data;
}

const productService = {
    getProducts,
    getProduct,
    addWishlist,
    rating
}

export default productService;