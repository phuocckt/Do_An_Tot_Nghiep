import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const getBrands = async () => {
    const res = await axios.get(`${base_url}brands/all-brands`);
    return res.data;
}

const getBrand = async (id) => {
    const res = await axios.get(`${base_url}brands/${id}`);
    return res.data;
}

const createBrand = async (brand) => {
    const res = await axios.post(`${base_url}brands/create-brand`, brand, config);
    return res.data;
}

const deleteBrand = async (id) => {
    try {
        const res = await axios.delete(`${base_url}brands/${id}`, config);
        return res.data;
    } catch (error) {
        console.error("Error creating product:", error.response?.data || error.message);
        throw error;
    }
}

const updateBrand = async (brand) => {
    const res = await axios.put(`${base_url}brands/${brand.id}`, brand.brandData, config);
    return res.data;
}

const brandService = {
    getBrands,
    createBrand,
    deleteBrand,
    updateBrand,
    getBrand
}

export default brandService;