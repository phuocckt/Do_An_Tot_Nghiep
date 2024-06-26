const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel")
const asyncHandler = require("express-async-handler");
const { param } = require("../routes/authRoute");
const { validateMongodbId } = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./emailCtrl");
const crypto = require("crypto");
const uniqid = require('uniqid');
const { cloudinaryUploadImg } = require("../utils/cloudinary");

//đăng kí user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email; //lấy email mà người người dùng nhập
    const findUser = await User.findOne({ email: email }); // tìm kiếm email và trả về 1 email duy nhất từ cơ sở dữ liệu
    if (!findUser) {// kiểm tra email chưa tồn tại
        // Tạo người dùng mới và đợi cho đến khi nó được tạo xong
        const newUser = await User.create(req.body); // tạo 1 user mới từ dữ liệu từ người dùng nhập
        res.json(newUser);
    } else {
        throw new Error("User Already Axists"); // user đã tồn tại
    }
});

//đăng nhập
const loginUserCtrl = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    // xem thử tài khoản người dùng có tồn tại hay không
    const findUser = await User.findOne({ email }); // tìm kiếm email trong cơ sở dữ liệu
    //Kiểm tra xem tài khoản người dùng có tồn tại và mật khẩu có khớp không
    if(findUser && (await findUser.isPasswordMatched(password))){ //isPasswordMatched dùng để so sánh mật khẩu
        //Nếu tài khoản và mật khẩu hợp lệ, tạo một token làm mới để cập nhật cho việc xác thực sau này
        const refreshToken = await generateRefreshToken(findUser?._id);
        //Cập nhật token mới vào cơ sở dữ liệu cho người dùng đăng nhập.
        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken
            },
            {
                new: true
            }
        );
        //Gửi một cookie chứa refresh token cho client với thời gian sống là 72 giờ
        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            maxAge: 72 * 60 * 60 *1000
        });
        //Gửi phản hồi JSON chứa thông tin người dùng và một token được tạo để sử dụng trong các yêu cầu sau này.
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            address: findUser?.address,
            images: findUser?.images,
            token: generateToken(findUser?._id)
        });
    } else{
        throw new Error("Invalid Credentials");
    }
});

// admin đăng nhập
const loginAdmin = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    // xem thử tài khoản người dùng có tồn tại hay không
    const findAdmin = await User.findOne({ email }); // tìm kiếm email trong cơ sở dữ liệu
    if(findAdmin.role !=='admin') throw new Error("Not Authorised");
    //Kiểm tra xem tài khoản người dùng có tồn tại và mật khẩu có khớp không
    if(findAdmin && (await findAdmin.isPasswordMatched(password))){ //isPasswordMatched dùng để so sánh mật khẩu
        //Nếu tài khoản và mật khẩu hợp lệ, tạo một token làm mới để cập nhật cho việc xác thực sau này
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        //Cập nhật token mới vào cơ sở dữ liệu cho người dùng đăng nhập.
        const updateUser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken
            },
            {
                new: true
            }
        );
        //Gửi một cookie chứa refresh token cho client với thời gian sống là 72 giờ
        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            maxAge: 72 * 60 * 60 *1000
        });
        //Gửi phản hồi JSON chứa thông tin người dùng và một token được tạo để sử dụng trong các yêu cầu sau này.
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            address: findAdmin?.address,
            images: findAdmin?.images,
            token: generateToken(findAdmin?._id)
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
    try {
        const getUser = await User.findById(id);
        res.json(getUser);
    } catch(error) {
        throw new Error(error);
    }
});

const handleRefreshToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies; //lấy cookie từ request gửi từ client
    //Kiểm tra xem có tồn tại refreshToken trong cookies hay không
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    //Gán giá trị của refreshToken từ cookies vào biến refreshToken
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No Refresh token present in database or not matched");
    //Xác minh refreshToken và tạo accessToken mới
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) throw new Error("There is something wrong with refresh token");
        //sử dụng generateToken() để tạo accessToken mới dựa trên id của người dùng.
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

// đăng xuất
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies; //lấy cookie từ request gửi từ client
    if (!cookie?.refreshToken) { // kiểm tra refreshToken có tồn tại không
        throw new Error("No Refresh Token in Cookies");
    }
    //Gán giá trị của refreshToken từ cookies vào biến refreshToken
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", { //xoá cookie refreshToken khỏi client.
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

    res.sendStatus(204);
});

// sửa 1 user
const updateAUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try{
        const getUser = await User.findByIdAndUpdate( // cập nhật thông tin người dùng nếu _id tồn tại
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
    //
    try {
        const getUser = await User.findByIdAndDelete(id);
        res.json(getUser);
    } catch(error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //
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
    //
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
    //validateMongodbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password; // gán giá trị password vào password trong user
        const updatePassword = await user.save(); //lưu
        res.json(updatePassword);
    } else {
        res.json(user);
    }
});

// quên mật khẩu
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found with this email" });
    }

    try {
        const token = await user.createPasswordResetToken(); // Tạo mã thông báo để đặt lại mật khẩu
        user.passwordResetToken = token; // Đặt mã thông báo đặt lại
        // Lấy ngày và thời gian hiện tại
        let currentDate = new Date();
        
        // Thêm 7 giờ cho múi giờ UTC+7
        currentDate.setHours(currentDate.getHours() + 7);

        user.passwordResetExpires = currentDate.getTime() + 10 * 60 * 1000; // Đặt thời gian hết hạn (10 phút)

        // Đảm bảo không có trường không hợp lệ nào xuất hiện trước khi lưu
        user.address = user.address || ''; // Đặt địa chỉ thành chuỗi trống nếu nó rỗng hoặc không xác định

        await user.save({ validateBeforeSave: true });

        // Tạo dữ liệu email
        const resetURL = `Chào, Vui lòng theo dõi liên kết này để đặt lại mật khẩu của bạn. Liên kết này có giá trị đến 10 phút kể từ bây giờ. <a href='http://localhost:3000/reset-password/${token}'>Liên kết ở đây</a>`;
        const data = {
            to: email,
            text: 'Chào bạn',
            subject: "Liên kết quên mật khẩu của bạn",
            htm: resetURL
        };

        // Gửi email đặt lại mật khẩu
        await sendEmail(data);

        res.json({ message: "Password reset link sent to email", token });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500).json({ message: error.message });
    }
});

/*
    Trong ngữ cảnh của mã hóa và bảo mật, "đối tượng băm" thường đề cập đến một hàm băm, là một hàm số hoặc thuật toán chuyển đổi dữ liệu đầu vào thành một giá trị băm duy nhất. Hàm băm này nhận đầu vào là một đoạn dữ liệu bất kỳ (thường là một chuỗi hoặc một tệp tin), và sau đó áp dụng một loạt các phép biến đổi để tạo ra một giá trị băm duy nhất có độ dài cố định, thường là một chuỗi hex hoặc một chuỗi nhị phân.

    Các tính chất chính của hàm băm là:

    Duy nhất: Mỗi dữ liệu đầu vào duy nhất sẽ sinh ra một giá trị băm duy nhất tương ứng.
    Không thể đảo ngược: Không thể từ giá trị băm quay lại dữ liệu gốc ban đầu.
    Nhỏ biến: Một thay đổi nhỏ trong dữ liệu đầu vào sẽ dẫn đến một giá trị băm khác biệt lớn.
    Tính xác định: Đối với cùng một dữ liệu đầu vào, giá trị băm được tạo ra luôn luôn là cố định.
    Trong ví dụ của bạn, crypto.createHash("sha256") tạo ra một đối tượng băm sử dụng thuật toán băm SHA-256, một trong các thuật toán băm phổ biến trong mã hóa và bảo mật. Đối tượng băm này được sử dụng để tạo ra một giá trị băm từ dữ liệu đầu vào, trong trường hợp này là token được truyền vào cho việc reset mật khẩu.
*/

// đặt lại mật khẩu
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    // Tạo mã băm với thuật toán sha256
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Tạo ngày hiện tại với múi giờ UTC+7
    let currentDate = new Date(); 
    currentDate.setHours(currentDate.getHours() + 7); // Chuyển đổi sang UTC+7

    // Tìm user với token và thời gian hết hạn phải lớn hơn thời điểm hiện tại
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gte: currentDate.getTime() }
    });

    if (!user) {
        throw new Error("Token Expired, Please try again later");
    }

    // Thiết lập lại mật khẩu và xoá thông tin reset mật khẩu
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    res.json(user);
});

// lưu địa chỉ
const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const saveAddress = await User.findByIdAndUpdate(
            _id,
            {
                address:req?.body?.address
            },
            {
                new: true
            }
        );
        res.json(saveAddress);
    } catch(error) {
        throw new Error(error);
    }
});

const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;

    try {
        let existingCart = await Cart.findOne({ orderby: _id });
        
        if (existingCart) {
            // If cart exists, update it
            for (let i = 0; i < cart.length; i++) {
                const { _id: productId, size, count } = cart[i];
                let found = false;

                // Check if product with same title and size exists in cart
                for (let j = 0; j < existingCart.products.length; j++) {
                    if (existingCart.products[j].product.toString() === productId && 
                        existingCart.products[j].size === size) {
                        // Update count if product with same title and size exists
                        existingCart.products[j].count += count;
                        found = true;
                        break;
                    }
                }

                // If product with same title and size not found, add new product to cart
                if (!found) {
                    const getProduct = await Product.findById(productId).select('price').exec();
                    const productPrice = getProduct.price;
                    existingCart.products.push({
                        product: productId,
                        size,
                        count,
                        price: productPrice
                    });
                }
            }

            // Calculate total cart amount
            let cartTotal = 0;
            existingCart.products.forEach(item => {
                cartTotal += item.price * item.count;
            });

            // Update cart total and save
            existingCart.cartTotal = cartTotal;
            await existingCart.save();

            res.json(existingCart);
        } else {
            // If cart does not exist, create new cart
            let products = [];
            for (let i = 0; i < cart.length; i++) {
                const { _id: productId, size, count } = cart[i];
                const getProduct = await Product.findById(productId).select('price').exec();
                const productPrice = getProduct.price;
                products.push({
                    product: productId,
                    size,
                    count,
                    price: productPrice
                });
            }

            // Calculate total cart amount
            let cartTotal = 0;
            products.forEach(item => {
                cartTotal += item.price * item.count;
            });

            // Save new cart
            let newCart = await new Cart({
                products,
                cartTotal,
                orderby: _id
            }).save();
        }
    } catch (error) {
        throw new Error(error);
    }
});

const UserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const cart = await Cart.findOne({ orderby: _id }).populate("products.product");
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOne({ orderby: user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the index of the product in the products array
        const productIndex = cart.products.findIndex(
            (product) => product.product.toString() === id
        );

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Remove the product from the products array
        cart.products.splice(productIndex, 1);

        // Recalculate cartTotal after removing the product
        let cartTotal = 0;
        cart.products.forEach((product) => {
            cartTotal += product.price * product.count;
        });

        // Update cartTotal in the cart document
        cart.cartTotal = cartTotal;

        // Save the updated cart
        await cart.save();

        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const applyCoupon = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { coupon } = req.body;
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (!validCoupon) {
        return res.status(400).json({ message: "Invalid Coupon" });
    }
    const user = await User.findOne({ _id });
    let { cartTotal } = await Cart.findOne({
        orderby: user._id,
    }).populate("products.product");
    let totalAfterDiscount = (
        cartTotal - 
        (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
        { orderby: user._id },
        { totalAfterDiscount },
        { new: true }
    );
    res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    try {
        if (!COD) throw new Error("Create cash order failed");
        const user = await User.findById(_id);
        const userCart = await Cart.findOne({ orderby: user._id });
        let finalAmount = couponApplied && userCart.totalAfterDiscount ? userCart.totalAfterDiscount : userCart.cartTotal;

        for (let item of userCart.products) {
            let product = await Product.findById(item.product._id);
            if (!product) throw new Error(`Product with ID ${item.product._id} not found`);
            if (product.quantity < item.count) {
                throw new Error(`Insufficient stock for product ${product.title}`);
            }
        }

        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent:{
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "vnd"
            },
            orderby: user._id,
            orderStatus: "Cash on Delivery"
        }).save();

        let update = userCart.products.map( item => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count }}
                }
            };
        });
        const updated = await Product.bulkWrite(update, {});
        await Cart.deleteOne({ orderby: user._id });
        res.json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const getOrders = await Order.findOne({ orderby: _id }).populate("products.product").exec();
        res.json(getOrders);
    } catch(error) {
        throw new Error(error);
    }
});

const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const getAllOrders = await Order.find().populate("products.product").populate("orderby").exec();
        res.json(getAllOrders);
    } catch(error) {
        throw new Error(error);
    }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id }  = req.params;
    const { status } = req.body;
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status
                }
            },
            {
                new: true
            }
        );
        res.json(updateOrderStatus)
    } catch (error) {
        throw new Error(error);
    }
});

const uploadAvatar = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {  
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);        
        }
        const images = urls.map((file) => {
            return file;
        })
        const findUser = await User.findByIdAndUpdate(
            id,
            {
                images: urls.map((file) => {
                    return file;
                })
            },
            {
                new: true
            }
        );
        res.json(images);
    } catch (error) {
        throw new Error(error);
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
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    saveAddress,
    userCart,
    UserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    getAllOrders,
    updateOrderStatus,
    uploadAvatar
};