import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import uploadService from "./uploadService";

export const uploadImage = createAsyncThunk(
    "upload/images",
    async (data, thunkAPI) => {
        try {
            const formData = new FormData();
            for (let i = 0; i < data.length; i++) {
                formData.append("images", data[i]);
            }
            return await uploadService.uploadImage(formData);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)
export const deleteImage = createAsyncThunk(
    "delete/images",
    async (id, thunkAPI) => {
        try {
            return await uploadService.deleteImage(id);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

const initialState = {
    images: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ""
};

export const uploadSlice = createSlice({
    name: "images",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(uploadImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.images = action.payload;
            })
            .addCase(uploadImage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(deleteImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.images = [];
            })
            .addCase(deleteImage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload;
            });
    }
});

export default uploadSlice.reducer;