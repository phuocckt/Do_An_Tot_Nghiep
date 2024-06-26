import axios from "axios";
import { base_url } from "../../utils/base_url";

const getCategories = async () => {
    const res = await axios.get(`${base_url}categories/all-category`);
    return res.data;
}

const categoryService = {
    getCategories
}

export default categoryService;