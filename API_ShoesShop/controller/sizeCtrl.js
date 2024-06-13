const Size = require("../models/sizeModel");
const asyncHandler = require("express-async-handler");

// tạo 1 thương hiệu
const createSize = asyncHandler(async (req, res) => {
    try {
        const title = req.body.title;
        const findSize = await Size.findOne({ title: title});
        if (!findSize) {
            const createSize = await Size.create(req.body);
            res.json(createSize);
        } else {
            throw new Error(error);
        }
    } catch (error) {
        throw new Error(error);
    }
});

// lấy tất cả thương hiệu
const getAllSize = asyncHandler(async (req, res) => {
    try{
        const getAllSize = await Size.find();
        res.json(getAllSize);
    } catch (error) {
        throw new Error(error);
    }
});

// lấy 1 thương hiệu
const getASize = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getASize = await Size.findById(id);
        res.json(getASize);
    } catch(error) {
        throw new Error(error);
    }
});

// sửa 1 loại sản phẩm
const updateSize = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        //// (new: true) : một tùy chọn cho phép bạn trả về bản ghi đã được cập nhật thay vì bản ghi gốc trước khi cập nhật
        const updateSize = await Size.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateSize);
    } catch(error) {
        throw new Error(error);
    }
});

// xóa 1 thương hiệu
const deleteSize = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteSize = await Size.findByIdAndDelete(id);
        res.json(deleteSize);
    } catch(error) {
        throw new Error(error);
    }
});

module.exports = {
    createSize, getAllSize, updateSize, getASize, deleteSize
};