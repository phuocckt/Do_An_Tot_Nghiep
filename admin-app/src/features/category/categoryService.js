import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const getCategories = async () => {
    const res = await axios.get(`${base_url}categories/all-category`);
    return res.data;
}

const getCategory = async (id) => {
    const res = await axios.get(`${base_url}categories/${id}`);
    return res.data;
}

const createCategory = async (category) => {
    const res = await axios.post(`${base_url}categories/create-category`, category, config);
    return res.data;
}

const updateCategory = async (category) => {
    const res = await axios.put(`${base_url}categories/${category.id}`, category.categoryData, config);
    return res.data;
}

const deleteCategory = async (id) => {
    try {
        const res = await axios.delete(`${base_url}categories/${id}`, config);
        return res.data;
    } catch (error) {
        console.error("Error creating product:", error.response?.data || error.message);
        throw error;
    }
}

const categoryService = {
    getCategories,
    createCategory,
    deleteCategory,
    getCategory,
    updateCategory
}

export default categoryService;