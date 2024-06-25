import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import categoryService from "./categoryService";

export const getCategories = createAsyncThunk(
    "category/get-categories",
    async (thunkAPI) => {
        try {
            return await categoryService.getCategories();
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const getCategory = createAsyncThunk(
    "category/get-category",
    async (id, thunkAPI) => {
        try {
            return await categoryService.getCategory(id);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const createCategory = createAsyncThunk(
    "category/create-category",
    async (category, thunkAPI) => {
        try {
            return await categoryService.createCategory(category);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const deleteCategory = createAsyncThunk(
    "category/delete-category",
    async (id, thunkAPI) => {
        try {
            return await categoryService.deleteCategory(id);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const updateCategory = createAsyncThunk(
    "category/update-category",
    async (category, thunkAPI) => {
        try {
            return await categoryService.updateCategory(category);
        } catch(error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
)

export const resetState = createAction("Reset_all");

const initialState = {
    categories: [],
    createdCategory: "",
    updatedCategory: "",
    categoryName: "",
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ""
};

export const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(createCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.createdCategory = action.payload;
                state.message = "Category created successfully!";
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(updateCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.updatedCategory = action.payload;
                state.message = "Category updated successfully!";
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(getCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.categoryName = action.payload.title;
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(resetState, () => initialState);
    }
});

export default categorySlice.reducer;