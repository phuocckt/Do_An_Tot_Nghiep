const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Khai báo Schema của mô hình Mongo
var userSchema = new mongoose.Schema(
    {
        firstname:{
            type:String,
            required:true,
        },
        lastname:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        mobile:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            default: "user"
        },
        isBlocked:{
            type: Boolean,
            default: false
        },
        cart:{
            type: Array,
            default: []
        },
        address:{ type: String },
        images: [],
        wishlist:[{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        refreshToken:{
            type: String
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date
    },
    {
        timestamps: true
    }
);

// mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10); // tạo ra một salt, một chuỗi ngẫu nhiên được sử dụng trong quá trình mã hóa mật khẩu và độ dài là 10 kí tự.
    this.password = await bcrypt.hash(this.password, salt);
});

// kiểm tra tính hợp lệ của mật khẩu khi người dùng đăng nhập
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    // so sánh mật khẩu nhập với mật khẩu được mã hóa
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 phút
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);