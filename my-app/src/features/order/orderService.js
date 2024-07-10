import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const getOrders = async () => {
    const res = await axios.get(`${base_url}user/orders-user`, config);
    return res.data;
}

const createOrder = async (data) => {
    const res = await axios.post(`${base_url}user/cart/cash-order`, data, config);
    return res.data;
}

const createPaymentOrder = async (params) => {
    const query = new URLSearchParams(params).toString();
    const res = await axios.get(`${base_url}user/cart/payment-order?${query}`, config);
    return res.data;
}

const cancelOrder = async (data) => {
    const res = await axios.put(`${base_url}user/order/update-order/${data.id}`,data.orderData, config);
    return res.data;
}

const orderService = {
    getOrders,
    createOrder,
    createPaymentOrder,
    cancelOrder
}

export default orderService;