import axios from "axios";

const axiosAdmin = axios.create({
    baseURL: `https://localhost:5000/api`,
    headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
    }
});

axiosAdmin.interceptors.response.use(
    res => res,
    error => {
        if (error.response.status === 401) {
            window.location.href = `http://localhost:3000/`;
        }
        console.error(`Error! Status Code: ` + error.response.status);
        return Promise.reject(error);
    }
);

export default axiosAdmin;