const getTokenFromLocalStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

export const config = {
    headers: {
        Authorization: getTokenFromLocalStorage?.token ? `Bearer ${getTokenFromLocalStorage.token}` : "",
        Accept: "application/json"
    }
};
