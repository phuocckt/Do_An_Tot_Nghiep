const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { createColor, getAColor, getAllColor, updateColor, deleteColor } = require("../controller/colorCtrl");

router.post("/create-color", authMiddleware, isAdmin, createColor);
router.get("/all-colors", getAllColor);
router.get("/:id", getAColor);
router.put("/:id", authMiddleware, isAdmin, updateColor);
router.delete("/:id", authMiddleware, isAdmin, deleteColor);

module.exports = router;