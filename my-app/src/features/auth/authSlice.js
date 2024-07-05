import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const getUserFromLocalStorage = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

const initialState = {
    user: getUserFromLocalStorage,
    carts: [],
    cart: "",
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ""
};

export const login = createAsyncThunk(
    "auth/login",
    async (user, thunkAPI) => {
        try {
            return await authService.login(user);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const register = createAsyncThunk(
    "auth/register",
    async (user, thunkAPI) => {
        try {
            return await authService.register(user);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const forgotPassword = createAsyncThunk(
    "auth/forgot-password",
    async (user, thunkAPI) => {
        try {
            return await authService.forgotPassword(user);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const resetPassword = createAsyncThunk(
    "auth/reset-password",
    async (user, thunkAPI) => {
        try {
            return await authService.resetPassword(user);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const getCart = createAsyncThunk(
    "auth/cart",
    async (thunkAPI) => {
        try {
            return await authService.getCart();
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const addToCart = createAsyncThunk(
    "auth/add-cart",
    async (user, thunkAPI) => {
        try {
            return await authService.addToCart(user);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const deleteCart = createAsyncThunk(
    "auth/delete-cart",
    async (id, thunkAPI) => {
        try {
            return await authService.deleteCart(id);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const applyCoupon = createAsyncThunk(
    "auth/apply-coupon",
    async (data, thunkAPI) => {
        try {
            return await authService.applyCoupon(data);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.user = null;
            })
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(register.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
            })
            .addCase(getCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.carts = action.payload;
            })
            .addCase(getCart.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
            })
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.cart = action.payload;
            })
            .addCase(addToCart.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;