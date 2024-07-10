// Function to get token from localStorage
const getTokenFromLocalStorage = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).token : null;
};

// Configuration object with Authorization header
export const config = {
    headers: {
        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        Accept: "application/json"
    }
};