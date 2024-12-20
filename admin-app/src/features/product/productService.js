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

const createProduct = async (product) => {
    try {
        const res = await axios.post(`${base_url}products/create-product`, product, config);
        return res.data;
    } catch (error) {
        console.error("Error creating product:", error.response?.data || error.message);
        throw error;
    }
}

const updateProduct = async (product) => {
    const res = await axios.put(`${base_url}products/${product.id}`, product.productData, config);
    return res.data;
}

const deleteProduct = async (id) => {
    try {
        const res = await axios.delete(`${base_url}products/${id}`, config);
        return res.data;
    } catch (error) {
        console.error("Error creating product:", error.response?.data || error.message);
        throw error;
    }
}

const productService = {
    getProducts,
    createProduct,
    deleteProduct,
    getProduct,
    updateProduct
}

export default productService;