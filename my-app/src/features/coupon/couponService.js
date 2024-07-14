import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const getCoupons = async () => {
    const res = await axios.get(`${base_url}coupons/all-coupon`);
    return res.data;
}

const getCoupon = async (id) => {
    const res = await axios.get(`${base_url}coupons/${id}`);
    return res.data;
}

const createCoupon = async (category) => {
    const res = await axios.post(`${base_url}coupons/create-coupon`, category, config);
    return res.data;
}

const deleteCoupon = async (id) => {
    try {
        const res = await axios.delete(`${base_url}coupons/${id}`, config);
        return res.data;
    } catch (error) {
        console.error("Error creating product:", error.response?.data || error.message);
        throw error;
    }
}

const categoryService = {
    getCoupons,
    createCoupon,
    deleteCoupon,
    getCoupon
}

export default categoryService;