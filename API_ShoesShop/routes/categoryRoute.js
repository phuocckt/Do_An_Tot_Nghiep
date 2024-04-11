const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { createCategory, updateCategory, getAllCategory, getACategory, deleteCategory } = require("../controller/categoryCtrl");

router.post('/create-category', authMiddleware, isAdmin, createCategory);
router.get('/all-category', getAllCategory);
router.get('/:id', getACategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory)

module.exports = router;