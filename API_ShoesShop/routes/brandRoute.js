const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { createBrand, getABrand, getAllBrand, updateBrand, deleteBrand } = require("../controller/brandCtrl");

router.post("/create-brand", authMiddleware, isAdmin, createBrand);
router.get("/all-brands", getAllBrand);
router.get("/:id", getABrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);

module.exports = router;