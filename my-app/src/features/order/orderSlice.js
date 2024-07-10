import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "./orderService";

export const getOrders = createAsyncThunk(
    "order/get-orders",
    async (thunkAPI) => {
        try {
            return await orderService.getOrders();
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const createOrder = createAsyncThunk(
    "order/create-order",
    async (data, thunkAPI) => {
        try {
            return await orderService.createOrder(data);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const createPaymentOrder = createAsyncThunk(
    "order/create-payment-order",
    async (params, thunkAPI) => {
        try {
            return await orderService.createPaymentOrder(params);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const cancelOrder = createAsyncThunk(
    "order/cancel-order",
    async (data, thunkAPI) => {
        try {
            return await orderService.cancelOrder(data);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

const initialState = {
    orders: [],
    createdOrder: "",
    createdPaymentOrder: "",
    orderCancelled: "",
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ""
};

export const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.orders = action.payload;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.createdOrder = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(createPaymentOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createPaymentOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.createdPaymentOrder = action.payload;
            })
            .addCase(createPaymentOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(cancelOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.orderCancelled = action.payload;
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            });
    }
});

export default orderSlice.reducer;