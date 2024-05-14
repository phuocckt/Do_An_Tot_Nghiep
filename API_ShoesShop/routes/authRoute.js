const express = require("express");
const { createUser, loginUserCtrl, getallUsers, getAUser, deleteAUser, updateAUser, blockUser, unBlockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, saveAddress, userCart, UserCart, emptyCart } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router =  express.Router();

router.post('/register', createUser);
router.post('/forgot-password', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.put('/password', authMiddleware, updatePassword);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdmin);
router.post('/cart', authMiddleware, userCart);
router.get('/all-users', getallUsers);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/cart', authMiddleware, UserCart);
router.get('/:id', authMiddleware, isAdmin, getAUser);
router.delete('/empty-cart', authMiddleware, emptyCart);
router.delete('/:id', deleteAUser);
router.put('/edit-user', authMiddleware, updateAUser);
router.put('/save-address', authMiddleware, saveAddress);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUser);

module.exports = router;