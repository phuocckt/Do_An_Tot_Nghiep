import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
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

export const getProduct = createAsyncThunk(
    "products/get-product",
    async (id, thunkAPI) => {
        try {
            return await productService.getProduct(id);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const createProduct = createAsyncThunk(
    "products/create-product",
    async (product, thunkAPI) => {
        try {
            return await productService.createProduct(product);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const deleteProduct = createAsyncThunk(
    "products/delete-product",
    async (id, thunkAPI) => {
        try {
            return await productService.deleteProduct(id);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const updateProduct = createAsyncThunk(
    "category/update-category",
    async (product, thunkAPI) => {
        try {
            return await productService.updateProduct(product);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const resetState = createAction("Reset_all");

const initialState = {
    products: [],
    createdProduct: "",
    updatedProduct: "",
    product: "",
    isError: false,
    isLoading: false,
    isSuccess: false,
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
                state.createdProduct = action.payload;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(updateProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.updatedProduct = action.payload;
                state.message = "Category updated successfully!";
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(getProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.product = action.payload;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(resetState, () => initialState);
    }
});

export default productSlice.reducer;