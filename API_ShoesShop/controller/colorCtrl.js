const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");

// tạo 1 thương hiệu
const createColor = asyncHandler(async (req, res) => {
    try {
        const title = req.body.title;
        const findColor = await Color.findOne({ title: title});
        if (!findColor) {
            const createColor = await Color.create(req.body);
            res.json(createColor);
        } else {
            throw new Error(error);
        }
    } catch (error) {
        throw new Error(error);
    }
});

// lấy tất cả thương hiệu
const getAllColor = asyncHandler(async (req, res) => {
    try{
        const getAllColor = await Color.find();
        res.json(getAllColor);
    } catch (error) {
        throw new Error(error);
    }
});

// lấy 1 thương hiệu
const getAColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getAColor = await Color.findById(id);
        res.json(getAColor);
    } catch(error) {
        throw new Error(error);
    }
});

// sửa 1 loại sản phẩm
const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        //// (new: true) : một tùy chọn cho phép bạn trả về bản ghi đã được cập nhật thay vì bản ghi gốc trước khi cập nhật
        const updateColor = await Color.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateColor);
    } catch(error) {
        throw new Error(error);
    }
});

// xóa 1 thương hiệu
const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteColor = await Color.findByIdAndDelete(id);
        res.json(deleteColor);
    } catch(error) {
        throw new Error(error);
    }
});

module.exports = {
    createColor, getAllColor, updateColor, getAColor, deleteColor
};