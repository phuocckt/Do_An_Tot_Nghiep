import axios from "axios";
import { base_url } from "../../utils/base_url";

const getOrders = async () => {
    const user = localStorage.getItem('user'); // Lấy token từ localStorage
    const parsedUser = JSON.parse(user); // Phân tích cú pháp đối tượng user
    const token = parsedUser.token;
    if (!token) {
        throw new Error("No token found");
    }
    const res = await axios.get(`${base_url}user/all-orders-user`, {
        headers: {
            Authorization: `Bearer ${token}` // Thêm token vào tiêu đề của yêu cầu
        }
    });
    return res.data;
}

const orderService = {
    getOrders
}

export default orderService;