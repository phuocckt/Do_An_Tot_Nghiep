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

const orderService = {
    getOrders,
    createOrder
}

export default orderService;