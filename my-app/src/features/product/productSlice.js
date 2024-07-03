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
export const addWishlist = createAsyncThunk(
    "products/wishlist",
    async (data, thunkAPI) => {
        try {
            return await productService.addWishlist(data);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

const initialState = {
    products: [],
    product: "",
    wishlist:"",
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ""
};

export const productSlice = createSlice({
    name: "products",
    initialState: {
        wishlist: [], // Ensure this is initialized as an array
        // ...other state
      },
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
            .addCase(addWishlist.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.wishlist = action.payload;
            })
            .addCase(addWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            });
    }
});

export default productSlice.reducer;