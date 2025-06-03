const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const Size = require("../models/sizeModel");
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
const bcrypt = require('bcryptjs');
const qs = require('qs');
const moment = require("moment");

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
    const { email, password } = req.body;
    // xem thử tài khoản người dùng có tồn tại hay không
    const findUser = await User.findOne({ email }); // tìm kiếm email trong cơ sở dữ liệu
    //Kiểm tra xem tài khoản người dùng có tồn tại và mật khẩu có khớp không
    if (findUser && (await findUser.isPasswordMatched(password))) { //isPasswordMatched dùng để so sánh mật khẩu
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
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
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
    } else {
        throw new Error("Invalid Credentials");
    }
});

// admin đăng nhập
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // xem thử tài khoản người dùng có tồn tại hay không
    const findAdmin = await User.findOne({ email }); // tìm kiếm email trong cơ sở dữ liệu
    if (findAdmin.role !== 'admin') throw new Error("Not Authorised");
    //Kiểm tra xem tài khoản người dùng có tồn tại và mật khẩu có khớp không
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) { //isPasswordMatched dùng để so sánh mật khẩu
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
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
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
    } else {
        throw new Error("Invalid Credentials");
    }
});

//lấy tất cả user
const getallUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

//lấy 1 user
const getAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getUser = await User.findById(id).populate({
            path: 'wishlist',
            populate: {
              path: 'brand', 
              model: 'Brand' 
            }
          }).exec();
        res.json(getUser);
    } catch (error) {
        throw new Error(error);
    }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
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
    try {
        const getUser = await User.findByIdAndUpdate( // cập nhật thông tin người dùng nếu _id tồn tại
            _id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
            address: req?.body?.address,
            role: req?.body?.role
        },
            {
                new: true
            }
        );
        res.json(getUser);
    } catch (error) {
        throw new Error(error);
    }
});

// sửa 1 user
const updateAUserByAdmin = asyncHandler(async (req, res) => {
    const { _id } = req.body;
    try {
        const getUser = await User.findByIdAndUpdate( // cập nhật thông tin người dùng nếu _id tồn tại
            _id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
            address: req?.body?.address,
            role: req?.body?.role
        },
            {
                new: true
            }
        );
        res.json(getUser);
    } catch (error) {
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
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //
    try {
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
    } catch (error) {
        throw new Error(error);
    }
});

const unBlockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //
    try {
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
    } catch (error) {
        throw new Error(error);
    }
});

// thay đổi mật khẩu
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(_id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Kiểm tra xem mật khẩu cũ có đúng không
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error('Mật khẩu cũ không đúng');
    }

    // Nếu mật khẩu cũ đúng, cập nhật mật khẩu mới
    if (newPassword) {
        user.password = newPassword;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(400);
        throw new Error('Mật khẩu mới không được bỏ trống');
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


    // Tạo ngày hiện tại với múi giờ UTC+7
    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7); // Chuyển đổi sang UTC+7
    const timestamp = currentDate.getTime();
    const date = new Date(timestamp);

    // Tìm user với token và thời gian hết hạn phải lớn hơn thời điểm hiện tại
    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: date }
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
                address: req?.body?.address
            },
            {
                new: true
            }
        );
        res.json(saveAddress);
    } catch (error) {
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
            existingCart.totalAfterDiscount = 0;
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
        const cart = await Cart.findOne({ orderby: _id })
                                .populate({ path: "products.product",
                                    populate: ({ path: "brand" })
                                });
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
        cart.totalAfterDiscount = 0;

        // Save the updated cart
        await cart.save();

        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { coupon } = req.body;
    console.log(coupon);
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (!validCoupon) {
        return res.status(400).json({ message: "Invalid Coupon" });
    }
    const user = await User.findOne({ _id });
    let { cartTotal } = await Cart.findOne({
        orderby: user._id,
    }).populate("products.product");
    let totalAfterDiscount = 0;
    await Cart.findOneAndUpdate(
        { orderby: user._id },
        { totalAfterDiscount: totalAfterDiscount },
        { new: true }
    );
    res.json(totalAfterDiscount);
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
        { totalAfterDiscount: totalAfterDiscount },
        { new: true }
    );
    res.json(coupon);
});

const createCashOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    try {
        if (!COD) throw new Error("Create cash order failed");
        const user = await User.findById(_id);
        const userCart = await Cart.findOne({ orderby: user._id }).populate({
            path: 'products.product',
            populate: {
                path: 'variants.size',
                model: 'Size'
            }
        });
        let finalAmount = userCart.totalAfterDiscount != 0 ? userCart.totalAfterDiscount : userCart.cartTotal;

        // Kiểm tra và cập nhật số lượng sản phẩm và các biến thể
        for (let item of userCart.products) {
            let product = await Product.findById(item.product._id).populate("variants.size");
            if (!product) throw new Error(`Product with ID ${item.product._id} not found`);

            // Kiểm tra số lượng trong các biến thể
            let variant = product.variants.find(variant => variant.size.title === item.size);
            if (variant && variant.quantity < item.count) {
                throw new Error(`Insufficient stock for product ${product.title} in size ${item.size}`);
            }

            if (product.quantity < item.count) {
                throw new Error(`Insufficient stock for product ${product.title}`);
            }
        }

        // Tạo đơn hàng mới
        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Pending",
                created: Date.now(),
                currency: "vnd"
            },
            orderby: user._id,
            orderStatus: "Pending"
        }).save();
        
        // Cập nhật số lượng sản phẩm và các biến thể
        let update = userCart.products.map(item => {
            let productUpdate = {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                }
            };
            const product = item.product;
            const size = item.size;
        
            const variant = product.variants.find(v => v.size && v.size.title === size);
        
            if (variant) {
                variant.quantity -= item.count;
            }
        
            return { product, productUpdate };
        });
        
        for (const item of update) {
            await item.product.save(); // Lưu từng sản phẩm một cách tuần tự để tránh lỗi ParallelSaveError
        }
        
        const bulkUpdate = update.map(item => item.productUpdate);
        
        const updated = await Product.bulkWrite(bulkUpdate, {});
        

        // Xóa giỏ hàng sau khi tạo đơn hàng
        await Cart.deleteOne({ orderby: user._id });
        res.json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const createPaymentOrder = asyncHandler(async (req, res) => {
    const { vnp_Amount, vnp_OrderInfo, vnp_TxnRef, vnp_SecureHash, vnp_ResponseCode } = req.query;
    const { _id } = req.user;

    try {
        // Validate the payment
        if (vnp_ResponseCode !== '00') {
            throw new Error("Payment failed");
        }

        // Fetch user and cart details
        const user = await User.findById(_id);
        const userCart = await Cart.findOne({ orderby: user._id }).populate({
            path: 'products.product',
            populate: {
                path: 'variants.size',
                model: 'Size'
            }
        });

        if (!userCart || userCart.products.length === 0) {
            return;
        }
        //let finalAmount = userCart.totalAfterDiscount != 0 ? userCart.totalAfterDiscount : userCart.cartTotal;

        // Check stock and update product quantities
        for (let item of userCart.products) {
            let product = await Product.findById(item.product._id).populate("variants.size");
            if (!product) throw new Error(`Product with ID ${item.product._id} not found`);

            // Check product stock
            if (product.quantity < item.count) {
                throw new Error(`Insufficient stock for product ${product.title}`);
            }

            // Check variant stock
            let variant = product.variants.find(variant => variant.size.title === item.size);
            if (variant && variant.quantity < item.count) {
                throw new Error(`Insufficient stock for product ${product.title} in size ${item.size}`);
            }
        }

        // Create new order
        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: vnp_TxnRef,
                method: "VNPAY",
                amount: vnp_Amount / 100,
                status: "Completed", // Assuming payment was successful
                created: Date.now(),
                currency: "vnd"
            },
            orderby: user._id,
            orderStatus: "Pending"
        }).save();

        // Update product quantities and variants
        let update = userCart.products.map(item => {
            let productUpdate = {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                }
            };
            const product = item.product;
            const size = item.size;

            const variant = product.variants.find(v => v.size && v.size.title === size);

            if (variant) {
                variant.quantity -= item.count;
            }

            product.save();

            return productUpdate;
        }).flat();
        const updated = await Product.bulkWrite(update, {});

        // Delete cart after creating order
        await Cart.deleteOne({ orderby: user._id });
        res.json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const createPayment = asyncHandler(async (req, res) => {
    try {
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const dateFormat = (await import('dateformat')).default;


        var tmnCode = "BPHR7PSX"
        var secretKey = "UPMVCO3UUSB53D86YM1VH45WZ01NENQV"
        var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        var returnUrl = "http://localhost:3000/payment-status"

        let date = new Date();
        // currentDate.setHours(currentDate.getHours() + 7); // Chuyển đổi sang UTC+7
        // const timestamp = currentDate.getTime();

        // Assuming 'date' is a valid Date object or timestamp
        let ExpireDate = new Date(); // Create a new Date object from the input
        // Add 10 minutes to the date
        ExpireDate.setMinutes(ExpireDate.getMinutes() + 10);

        // Convert the date to a string in ISO format and slice to get 'yyyy-mm-ddTHH:mm:ss'
        let isoString =
            ExpireDate.toISOString();

        // Replace '-' and 'T' to get 'yyyymmddHHmmss' format
        ExpireDate = isoString.replace(/-/g, '').replace(/T/g, '');

        // Trim trailing zeros and ensure the format is consistent
        ExpireDate = ExpireDate.slice(0, -2).padStart(14, '0'); // Pad with zeros if necessary

        console.log(ExpireDate);

        var vnp_ExpireDate = ExpireDate;
        var createDate = moment(date).format('YYYYMMDDHHmmss');
        var orderId = dateFormat(date, 'HHmmss');
        var amount = req.body.amount;
        // var bankCode = req.body.bankCode;

        var orderInfo = req.body.orderDescription;
        var orderType = req.body.orderType;
        var locale = req.body.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = '';
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = '1.54.5.211';
        vnp_Params['vnp_CreateDate'] = createDate;
        // vnp_Params['vnp_ExpireDate'] = vnp_ExpireDate;
        // if (bankCode !== null && bankCode !== '') {
        //     vnp_Params['vnp_BankCode'] = bankCode;
        // }

        vnp_Params = sortObject(vnp_Params);

        var signData = qs.stringify(vnp_Params, { encode: false });
        var hmac = crypto.createHmac("sha512", secretKey);
        console.log(hmac);
        const signDataBytes = Buffer.from(signData, 'utf-8');
        const signed = hmac.update(signDataBytes).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

        res.json(vnpUrl);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}


const vnpayIpn = asyncHandler(async (req, res) => {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    var config = require('config');
    var secretKey = config.get('vnp_HashSecret');
    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");


    if (secureHash === signed) {
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        res.status(200).json({ RspCode: '00', Message: 'success' })
    }
    else {
        res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
    }
})

const vnpayReturn = asyncHandler(async (req, res) => {
    var vnp_Params = req.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    var config = require('config');
    var tmnCode = config.get('vnp_TmnCode');
    var secretKey = config.get('vnp_HashSecret');

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        res.render('success', { code: vnp_Params['vnp_ResponseCode'] })
    } else {
        res.render('success', { code: '97' })
    }
});

const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const getOrders = await Order.find({ orderby: _id })
            .populate("products.product")
            .exec();
        
        // Sắp xếp thủ công tăng dần theo createdAt
        const sortedOrders = getOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        
        res.json(sortedOrders);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const getAllOrders = await Order.find().populate("products.product").populate("orderby").exec();
        res.json(getAllOrders);
    } catch (error) {
        throw new Error(error);
    }
});

const getOrdersByUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const getAllOrders = await Order.find({ orderby: _id })
            .sort({ createdAt: -1 }) // Sắp xếp tăng dần
            .populate({
                path: "products.product",
                populate: {
                    path: "brand",
                    model: "Brand"
                }
            })
            .populate("orderby")
            .exec();
        res.json(getAllOrders);
    } catch (error) {
        throw new Error(error);
    }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findById(id).populate({
            path: 'products.product',
            populate: {
                path: 'variants.size',
                model: 'Size'
            }
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.orderStatus = status;
        // Update product quantities and sold counts if the order is cancelled
        if (status === "Cancelled" && order.orderStatus === "Cancelled") {
            for (const item of order.products) {
                const product = item.product;
                const size = item.size;

                // Find the variant with the correct size and update its quantity
                const variant = product.variants.find(v => v.size && v.size.title === size);
                console.log(variant);
                if (variant) {
                    variant.quantity += item.count;
                    console.log(variant.quantity);
                }

                // Update overall product quantity and sold count
                product.quantity += item.count;
                product.sold -= item.count;

                await product.save();
            }
        }

        // Update the order status
        order.paymentIntent.status = status;
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
    updateAUserByAdmin,
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
    deleteCoupon,
    createCashOrder,
    createPaymentOrder,
    getOrders,
    getAllOrders,
    updateOrderStatus,
    uploadAvatar,
    getOrdersByUser,
    createPayment,
    vnpayIpn,
    vnpayReturn
};