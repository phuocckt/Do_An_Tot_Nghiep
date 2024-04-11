const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// tạo 1 thương hiệu
const createBrand = asyncHandler(async (req, res) => {
    try {
        const title = req.body.title;
        const findBrand = await Brand.findOne({ title: title});
        if (!findBrand) {
            const createBrand = await Brand.create(req.body);
            res.json(createBrand);
        }
    } catch (error) {
        throw new Error(error);
    }
});

// lấy tất cả thương hiệu
const getAllBrand = asyncHandler(async (req, res) => {
    try{
        const getAllBrand = await Brand.find();
        res.json(getAllBrand);
    } catch (error) {
        throw new Error(error);
    }
});

// lấy 1 thương hiệu
const getABrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getABrand = await Brand.findById(id);
        res.json(getABrand);
    } catch(error) {
        throw new Error(error);
    }
});

// sửa 1 loại sản phẩm
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    validateMongoDbId(id);
    try {
        //// (new: true) : một tùy chọn cho phép bạn trả về bản ghi đã được cập nhật thay vì bản ghi gốc trước khi cập nhật
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateBrand);
    } catch(error) {
        throw new Error(error);
    }
});

// xóa 1 thương hiệu
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteBrand = await Brand.findByIdAndDelete(id);
        res.json(deleteBrand);
    } catch(error) {
        throw new Error(error);
    }
});

module.exports = {
    createBrand, getAllBrand, updateBrand, getABrand, deleteBrand
};