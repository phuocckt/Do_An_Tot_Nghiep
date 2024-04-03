const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

// tạo sản phẩm
const createProduct = asyncHandler(async(req, res) => {
    const title = req.body.title;
    const findProduct = await Product.findOne({ title: title });
    if (!findProduct) { // kiểm tra tên sản phẩm có tồn tại chưa
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        // Tạo sản phẩm mới và đợi cho đến khi nó được tạo xong
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } else {
        throw new Error("Product Already Axists");
    }
});

// lấy tất cả sản phẩm
const getAllProduct = asyncHandler(async (req, res) => {
    try{
        const queryObj = { ...req.query }; //sao chép tất cả các tham số query từ request
        //tạo ra một mảng các trường không mong muốn trong các tham số query
        const excludeFields = ["page", "sort", "limit", "fields"]; //ví dụ như "page", "sort", "limit", "fields".
        // sử dụng forEach để loại bỏ chúng khỏi đối tượng queryObj bằng cách sử dụng delete
        excludeFields.forEach((el) => delete queryObj[el]);
        //chuyển đổi đối tượng queryObj thành một chuỗi JSON
        let queryStr = JSON.stringify(queryObj);
        // sử dụng phương thức replace() kết hợp với biểu thức chính quy (/\b(gte|gt|lte|lt)\b/g) để thay thế các toán tử so sánh có trong chuỗi bằng cách thêm dấu $ phía trước. Điều này là để phù hợp với cú pháp của MongoDB khi sử dụng các toán tử so sánh như $gte, $gt, $lte, $lt.
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        
        // sử dụng phương thức find 
        let query = Product.find(JSON.parse(queryStr));//điều kiện được định nghĩa từ đối tượng query đã được biến đổi từ chuỗi JSON trước đó thông qua JSON.parse().

        // Sắp xếp
        if (req.query.sort) { // Nếu có tham số sort được truyền trong request
            //tách chuỗi sort thành một mảng các trường cần sắp xếp, được phân tách bởi dấu phẩy (,)
            //nó sử dụng join(" ") để nối các trường này lại với nhau, phân tách bởi khoảng trắng, tạo thành một chuỗi sắp xếp hợp lệ cho MongoDB
            const sortBy = req.query.sort.split(",").join(" ");
            //nếu có tham số sort, thì sẽ áp dụng sắp xếp vào truy vấn MongoDB. Cụ thể, nó sẽ sắp xếp kết quả truy vấn theo các trường được chỉ định trong chuỗi sortBy
            query = query.sort(sortBy);
        } else {
            //không có tham số sort được truyền trong request, đoạn mã sẽ sắp xếp kết quả theo trường createAt (hoặc createdAt tùy vào thiết lập), và sẽ sắp xếp theo thứ tự giảm dần bằng cách đặt dấu trừ (-) trước tên trường
            query = query.sort("-createdAt");
        }

        // Giới hạn của fields
        if (req.query.fields) { // Nếu có tham số fields được truyền trong request
            //tách chuỗi fields thành một mảng các trường cần sắp xếp, được phân tách bởi dấu phẩy (,)
            //nó sử dụng join(" ") để nối các trường này lại với nhau, phân tách bởi khoảng trắng, tạo thành một chuỗi sắp xếp hợp lệ cho MongoDB
            const fields = req.query.fields.split(",").join(" ");
            //nếu có tham số fields, thì sẽ áp dụng sắp xếp vào truy vấn MongoDB. Cụ thể, nó sẽ sắp xếp kết quả truy vấn theo các trường được chỉ định trong chuỗi fields sẽ được trả về từ truy vấn.
            query = query.select(fields);
        } else {
            //không có tham số fields được truyền trong request, đoạn code sẽ chọn mặc định trường __v
            query = query.select("-__v");
        }

        // Phân trang
        //lấy giá trị của tham số page và limit từ req.query.
        const page = req.query.page;
        const limit = req.query.limit;
        //Giá trị skip được tính dựa trên page và limit. Nó xác định số lượng tài liệu cần bỏ qua từ kết quả trước khi bắt đầu lấy các sản phẩm
        const skip = (page - 1) * limit;
        //mã này áp dụng phân trang vào truy vấn MongoDB bằng cách sử dụng phương thức skip() để bỏ qua các sản phẩm không cần thiết và limit() để giới hạn số lượng sản phẩm trả về
        query = query.skip(skip).limit(limit);
        if (req.query.page) { //kiểm tra xem tham số page có được truyền không
            //đếm số lượng tài liệu trong bộ sưu tập Product
            const productCount = await Product.countDocuments();
            //Kiểm tra xem trang được yêu cầu có tồn tại không bằng cách so sánh giá trị skip với số lượng sản phẩm trong productCount
            //Nếu trang không tồn tại (tức là số lượng phẩm cần bỏ qua lớn hơn hoặc bằng tổng số lượng sản phẩm), một lỗi sẽ được ném
            if (skip >= productCount) throw new Error("This Page doesn't exists");
        }

        const products = await query;
        res.json(products);
    } catch(error) {
        throw new Error(error);
    }
});

// lấy 1 sản phẩm
const getAProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //validateMongodbId(id);
    try {
        const getProducts = await Product.findById(id);
        res.json(getProducts);
    } catch(error) {
        throw new Error(error);
    }
});

// sửa 1 sản phẩm
const updateAProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try{
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate(id, req.body,{ new: true }
        );
        res.json(updateProduct);
    } catch(error) {
        throw new Error(error);
    }
});

// xóa 1 sản phẩm
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);
    } catch(error) {
        return new Error(error);
    }
});

module.exports = {
    createProduct,
    getAllProduct,
    getAProduct,
    updateAProduct,
    deleteProduct
};