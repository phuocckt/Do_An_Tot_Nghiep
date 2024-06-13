const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");


// tạo 1 loại sản phẩm
const createCategory = asyncHandler(async (req, res) => {
    try {
        const title = req.body.title;
        const findCategory = await Category.findOne({ title: title});
        if (!findCategory) {
            const createCategory = await Category.create(req.body);
            res.json(createCategory);
        }
    } catch (error) {
        throw new Error(error);
    }
});

// lấy tất cả loại sản phẩm 
const getAllCategory = asyncHandler(async (req, res) => {
    try{
        const getAllCategory = await Category.find();
        res.json(getAllCategory);
    } catch (error) {
        throw new Error(error);
    }
});

// lấy 1 loại sản phẩm 
const getACategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    try {
        const getACategory = await Category.findById(id);
        res.json(getACategory);
    } catch(error) {
        throw new Error(error);
    }
});

// sửa 1 loại sản phẩm
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    try {
        //// (new: true) : một tùy chọn cho phép bạn trả về bản ghi đã được cập nhật thay vì bản ghi gốc trước khi cập nhật
        const updateCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateCategory);
    } catch(error) {
        throw new Error(error);
    }
});

// xóa 1 loại sản phẩm
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    try {
        const deleteCategory = await Category.findByIdAndDelete(id);
        res.json(deleteCategory);
    } catch(error) {
        throw new Error(error);
    }
});

module.exports = {
    createCategory, getAllCategory, updateCategory, getACategory, deleteCategory
};