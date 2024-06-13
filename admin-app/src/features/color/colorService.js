import axios from "axios";
import { base_url } from "../../utils/base_url";

const getColors = async () => {
    const res = await axios.get(`${base_url}colors/all-colors`);
    return res.data;
}

const colorService = {
    getColors
}

export default colorService;