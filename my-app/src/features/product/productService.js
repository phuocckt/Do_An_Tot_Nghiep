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
const productService = {
    getProducts,
    getProduct
}

export default productService;