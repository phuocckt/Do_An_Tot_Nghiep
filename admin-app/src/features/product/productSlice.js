import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./productService";

export const getProducts = createAsyncThunk(
    "products/get-products",
    async (thunkAPI) => {
        try {
            return await productService.getProducts();
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const createProduct = createAsyncThunk(
    "products/create-products",
    async (product, thunkAPI) => {
        try {
            return await productService.createProduct(product);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const deleteProduct = createAsyncThunk(
    "products/delete-products",
    async (id, thunkAPI) => {
        try {
            return await productService.deleteProduct(id);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

const initialState = {
    products: [],
    createdProduct: "",
    isError: false,
    isLoading: false,
    isSuccess: false,
    isCreate: false,
    message: ""
};

export const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.isCreate = false;
                state.products = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(createProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.isCreate = true;
                state.createdProduct = action.payload;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            });
    }
});

export default productSlice.reducer;