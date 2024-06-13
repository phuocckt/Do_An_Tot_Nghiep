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

const initialState = {
    orders: [],
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
            });
    }
});

export default orderSlice.reducer;