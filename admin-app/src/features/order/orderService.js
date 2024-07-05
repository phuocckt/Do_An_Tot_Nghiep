import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const getOrders = async () => {
    const res = await axios.get(`${base_url}user/all-orders-user`, config);
    return res.data;
}

const updateOrderStatus = async (data) => {
    const res = await axios.put(`${base_url}user/order/update-order/${data.id}`,data.orderData, config);
    return res.data;
}

const orderService = {
    getOrders,
    updateOrderStatus
}

export default orderService;