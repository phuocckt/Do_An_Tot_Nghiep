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
export const createSize = createAsyncThunk(
    "size/create-sizes",
    async (size, thunkAPI) => {
        try {
            return await sizeService.createSize(size);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

const initialState = {
    sizes: [],
    createdSize: "",
    isError: false,
    isLoading: false,
    isSuccess: false,
    isCreate: false,
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
                state.isCreate = false;
                state.sizes = action.payload;
            })
            .addCase(getSizes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(createSize.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createSize.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.isCreate = true;
                state.createdSize = action.payload;
                state.message = "Size created successfully!";
            })
            .addCase(createSize.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            });
    }
});

export default sizeSlice.reducer;