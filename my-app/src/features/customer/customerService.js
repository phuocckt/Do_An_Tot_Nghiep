import axios from "axios";
import { base_url } from "../../utils/base_url";

const getUsers = async () => {
    const res = await axios.get(`${base_url}user/all-users`);
    return res.data;
}

const getUser = async (id) => {
    const res = await axios.get(`${base_url}user/${id}`);
    return res.data;
}

const customerService = {
    getUsers,
    getUser
}

export default customerService;