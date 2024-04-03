const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// kiểm tra request có chứa token không và nếu có thì thì người dùng được gắn vào req.user
const authMiddleware = asyncHandler(async(req, res, next) => {
    let token;
    // Nếu request chứa token (bắt đầu bằng "Bearer"), nó sẽ lấy token ra khỏi header
    if (req?.headers?.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
        try {
            //Nếu token hợp lệ, nó sẽ trích xuất thông tin người dùng từ token
            if (token) {
                //Nếu người dùng được tìm thấy, thông tin của họ được gắn vào đối tượng request để các middleware hoặc handlers khác có thể truy cập thông tin này.
                const decoded = jwt.verify(token,process.env.JWT_SECRET);
                // tìm kiếm id user trong token
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch(error) {
            // Nếu không tìm thấy hoặc có lỗi xảy ra trong quá trình này, một lỗi sẽ được ném, ngăn cản middleware tiếp theo được gọi và Express sẽ xử lý lỗi này.
            throw new Error("Not Authorized token expired, Please login again");
        }
    } else {
        throw new Error("There is no token attached to header");
    }
});

// Sau khi kiểm tra token xong thì hàm này sẽ kiểm tra user này có phải là admin không
const isAdmin = asyncHandler(async(req, res, next) => {
    // lấy thông tin email từ đối tượng người dùng
    const { email } = req.user;
    //tìm kiếm người dùng tương ứng trong cơ sở dữ liệu dựa trên email này.
    const adminUser = await User.findOne({ email });
    // Kiểm tra người dùng có phải là admin không
    if (adminUser.role !== "admin"){
        // KQ:người dùng không phải là admin
        throw new Error("You aren't an admin");
    } else {
        //KQ: người dùng được tìm thấy và có vai trò là admin
        next();
    }
});

module.exports = { authMiddleware, isAdmin };