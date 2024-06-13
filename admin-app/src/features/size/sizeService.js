import axios from "axios";
import { base_url } from "../../utils/base_url";

const getSizes = async () => {
    const res = await axios.get(`${base_url}sizes/all-sizes`);
    return res.data;
}

const sizeService = {
    getSizes
}

export default sizeService;