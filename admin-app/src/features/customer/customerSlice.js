import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "./customerService";

export const getUsers = createAsyncThunk(
    "customer/get-customers",
    async (thunkAPI) => {
        try {
            return await customerService.getUsers();
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const getUser = createAsyncThunk(
    "customer/get-customer",
    async (id, thunkAPI) => {
        try {
            return await customerService.getUser(id);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const updateUser = createAsyncThunk(
    "customer/update-customer",
    async (data, thunkAPI) => {
        try {
            return await customerService.updateUser(data);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)


const initialState = {
    customers: [],
    customer: "",
    update: "",
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ""
};

export const customerSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.customers = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(getUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.customer = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.update = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            });
    }
});

export default customerSlice.reducer;