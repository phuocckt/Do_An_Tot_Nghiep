import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const getSizes = async () => {
    const res = await axios.get(`${base_url}sizes/all-sizes`);
    return res.data;
}

const createSize = async (size) => {
    const res = await axios.post(`${base_url}sizes/create-size`, size, config);
    return res.data;
}

const sizeService = {
    getSizes,
    createSize
}

export default sizeService;