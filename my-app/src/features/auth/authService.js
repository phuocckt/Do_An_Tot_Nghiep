import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const login = async (userData) => {
    const res = await axios.post(`${base_url}user/login`, userData);
    if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data))
    }
    return res.data;
}

const register = async (userData) => {
    const res = await axios.post(`${base_url}user/register`, userData);
    return res.data;
}

const forgotPassword = async (email) => {
    const res = await axios.post(`${base_url}user/forgot-password`, email);
    if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data))
    }
    return res.data;
}

const resetPassword = async (userData) => {
    const res = await axios.put(`${base_url}user/reset-password/${userData.token}`, userData.password);
    if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data))
    }
    return res.data;
}

const getCart = async () => {
    const res = await axios.get(`${base_url}user/carts`, config);
    return res.data;
}

const addToCart = async (userData) => {
    const res = await axios.post(`${base_url}user/cart`, userData, config);
    return res.data;
}

const deleteCart = async (id) => {
    const res = await axios.delete(`${base_url}user/empty-cart/${id}`, config);
    return res.data;
}

const applyCoupon = async (data) => {
    const res = await axios.post(`${base_url}user/cart/apply-coupon`, data, config);
    return res.data;
}

const payment = async (data) => {
    const res = await axios.post(`${base_url}user/cart/create_payment_url`, data, config);
    return res.data;
}

const authService = {
    login,
    register,
    forgotPassword,
    resetPassword,
    getCart,
    addToCart,
    deleteCart,
    applyCoupon,
    payment
}

export default authService;