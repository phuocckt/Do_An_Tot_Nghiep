const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto } = require("../middlewares/uploadImages");

router.post("/", authMiddleware, isAdmin, uploadPhoto.array("images", 10), uploadImages);
router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;