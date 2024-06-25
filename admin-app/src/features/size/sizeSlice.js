import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
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

export const getSize = createAsyncThunk(
    "size/get-size",
    async (id, thunkAPI) => {
        try {
            return await sizeService.getSize(id);
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

export const deleteSize = createAsyncThunk(
    "size/delete-size",
    async (id, thunkAPI) => {
        try {
            return await sizeService.deleteSize(id);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const updateSize = createAsyncThunk(
    "size/update-size",
    async (size, thunkAPI) => {
        try {
            return await sizeService.updateSize(size);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const resetState = createAction("Reset_all");

const initialState = {
    sizes: [],
    createdSize: "",
    updatedSize:"",
    sizeName: "",
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
            })
            .addCase(createSize.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createSize.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.createdSize = action.payload;
                state.message = "Size created successfully!";
            })
            .addCase(createSize.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(updateSize.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSize.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.updatedSize = action.payload;
                state.message = "Size updated successfully!";
            })
            .addCase(updateSize.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(getSize.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSize.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.sizeName = action.payload.title;
            })
            .addCase(getSize.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(resetState, () => initialState);

    }
});

export default sizeSlice.reducer;