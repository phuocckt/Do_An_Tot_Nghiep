const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { param } = require("../routes/authRoute");
const { validateMongodbId } = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

//đăng kí user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        // Tạo người dùng mới và đợi cho đến khi nó được tạo xong
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("User Already Axists");
    }
});

//đăng nhập
const loginUserCtrl = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    // xem thử tài khoản người dùng có tồn tại hay không
    const findUser = await User.findOne({ email });
    if(findUser && (await findUser.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken
            },
            {
                new: true
            }
        )
        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            maxAge: 72 * 60 * 60 *1000
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    } else{
        throw new Error("Invalid Credentials");
    }
});

//lấy tất cả user
const getallUsers = asyncHandler(async (req, res) => {
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    } catch(error) {
        throw new Error(error);
    }
});

//lấy 1 user
const getAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getUser = await User.findById(id);
        res.json(getUser);
    } catch(error) {
        throw new Error(error);
    }
});

const handleRefreshToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No Refresh token present in database or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) throw new Error("There is something wrong with refresh token");
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

// đăng xuất
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error("No Refresh Token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204); // No Content
    }
    // Cập nhật refreshToken của người dùng thành rỗng
    await User.findOneAndUpdate({ refreshToken }, { $set: { refreshToken: "" } });
    // Xoá cookie refreshToken khỏi client
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });

    res.sendStatus(204); // No Content
});

// sửa 1 user
const updateAUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try{
        const getUser = await User.findByIdAndUpdate(
            _id,{
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
            },
            {
                new: true
            }
        );
        res.json(getUser);
    } catch(error) {
        throw new Error(error);
    }
});

//xóa 1 user
const deleteAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getUser = await User.findByIdAndDelete(id);
        res.json(getUser);
    } catch(error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true
            },
            {
                new: true
            }
        );
        res.json(block);
    } catch(error) {
        throw new Error(error);
    }
});

const unBlockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false
            },
            {
                new: true
            }
        );
        res.json(unblock);
    } catch(error) {
        throw new Error(error);
    }
});

// thay đổi mật khẩu
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const password = req.body.password;
    validateMongodbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);
    } else {
        res.json(user);
    }
});


module.exports = { 
    createUser, 
    loginUserCtrl, 
    getallUsers, 
    getAUser, 
    deleteAUser, 
    updateAUser,
    blockUser,
    unBlockUser,
    handleRefreshToken,
    logout,
    updatePassword
};