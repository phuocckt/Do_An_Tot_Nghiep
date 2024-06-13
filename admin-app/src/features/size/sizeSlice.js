import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sizeService from "./sizeService";

export const getSizes = createAsyncThunk(
    "size/get-sizes",
    async (thunkAPI) => {
        try {
            return await sizeService.getSizes();
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

const initialState = {
    sizes: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ""
};

export const sizeSlice = createSlice({
    name: "sizes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSizes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSizes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.sizes = action.payload;
            })
            .addCase(getSizes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            });
    }
});

export default sizeSlice.reducer;