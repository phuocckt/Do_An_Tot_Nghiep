import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const getUsers = async () => {
    const res = await axios.get(`${base_url}user/all-users`);
    return res.data;
}

const getUser = async (id) => {
    const res = await axios.get(`${base_url}user/${id}`, config);
    return res.data;
}

const updateUser = async (data) => {
    const res = await axios.put(`${base_url}user/edit-user-by-admin`, data, config);
    return res.data;
}

const customerService = {
    getUsers,
    getUser,
    updateUser
}

export default customerService;