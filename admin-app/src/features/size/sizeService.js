import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const getSizes = async () => {
    const res = await axios.get(`${base_url}sizes/all-sizes`);
    return res.data;
}

const getSize = async (id) => {
    const res = await axios.get(`${base_url}sizes/${id}`);
    return res.data;
}

const createSize = async (size) => {
    const res = await axios.post(`${base_url}sizes/create-size`, size, config);
    return res.data;
}

const updateSize = async (size) => {
    const res = await axios.put(`${base_url}sizes/${size.id}`, size.sizeData, config);
    return res.data;
}

const deleteSize = async (id) => {
    try {
        const res = await axios.delete(`${base_url}sizes/${id}`, config);
        return res.data;
    } catch (error) {
        throw error;
    }
}

const sizeService = {
    getSizes,
    createSize,
    getSize,
    deleteSize,
    updateSize
}

export default sizeService;