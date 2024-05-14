const express = require("express");
const { createProduct, getAllProduct, updateAProduct, getAProduct, deleteProduct, addWishList, rating, uploadImages } = require("../controller/productCtrl");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto } = require("../middlewares/uploadImages");

router.post("/create-product", authMiddleware, isAdmin, createProduct);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 10), uploadImages);
router.get("/all-products", getAllProduct);
router.get("/:id", getAProduct);
router.put('/wishlist', authMiddleware, addWishList);
router.put('/rating', authMiddleware, rating);
router.put("/:id", authMiddleware, isAdmin, updateAProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;