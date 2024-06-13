const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { createSize, getASize, getAllSize, updateSize, deleteSize } = require("../controller/sizeCtrl");

router.post("/create-size", authMiddleware, isAdmin, createSize);
router.get("/all-sizes", getAllSize);
router.get("/:id", getASize);
router.put("/:id", authMiddleware, isAdmin, updateSize);
router.delete("/:id", authMiddleware, isAdmin, deleteSize);

module.exports = router;