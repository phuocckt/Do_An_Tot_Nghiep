const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { createCoupon, getAllCoupon, getACoupon, deleteACoupon } = require("../controller/couponCtrl");

router.post('/create-coupon', authMiddleware, isAdmin, createCoupon);
router.get('/all-coupon', getAllCoupon);
router.get('/:id', getACoupon);
router.delete('/:id', authMiddleware, isAdmin, deleteACoupon);

module.exports = router;