const express = require("express");
const { createProduct, getAllProduct, updateAProduct, getAProduct, deleteProduct, addWishList, rating } = require("../controller/productCtrl");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto } = require("../middlewares/uploadImages");

router.post("/create-product", authMiddleware, isAdmin, createProduct);
router.get("/all-products", getAllProduct);
router.get("/:slug", getAProduct);
router.put('/wishlist', authMiddleware, addWishList);
router.put('/rating', authMiddleware, rating);
router.put("/:id", authMiddleware, isAdmin, updateAProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;