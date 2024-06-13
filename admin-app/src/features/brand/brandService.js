import axios from "axios";
import { base_url } from "../../utils/base_url";

const getBrands = async () => {
    const res = await axios.get(`${base_url}brands/all-brands`);
    return res.data;
}

const brandService = {
    getBrands
}

export default brandService;