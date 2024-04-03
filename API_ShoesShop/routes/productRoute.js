const express = require("express");
const { createProduct, getAllProduct, updateAProduct, getAProduct, deleteProduct } = require("../controller/productCtrl");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create-product", authMiddleware, isAdmin, createProduct);
router.get("/all-products", getAllProduct);
router.get("/:id", getAProduct);
router.put("/:id", authMiddleware, isAdmin, updateAProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;