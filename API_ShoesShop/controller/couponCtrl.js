const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");


// tạo 1 phiếu giảm giá
const createCoupon = asyncHandler(async (req, res) => {
    try {
        const name = req.body.name;
        const findCoupon = await Coupon.findOne({ name: name });
        if (!findCoupon) {
            const createCoupon = await Coupon.create(req.body);
            res.json(createCoupon);
        }
    } catch (error) {
        throw new Error(error);
    }
});

// lấy tất cả phiếu giảm giá
const getAllCoupon = asyncHandler(async (req, res) => {
    try {
        const getAllCoupon = await Coupon.find();
        res.json(getAllCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

// lấy 1 phiếu giảm giá
const getACoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    try {
        const getACoupon = await Coupon.findById(id);
        res.json(getACoupon);
    } catch (error) {
        throw new Error(error);
    }
});

// xóa 1 phiếu giảm giá
const deleteACoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    try {
        const deleteACoupon = await Coupon.findByIdAndDelete(id);
        res.json(deleteACoupon);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createCoupon,
    getAllCoupon,
    getACoupon,
    deleteACoupon
};