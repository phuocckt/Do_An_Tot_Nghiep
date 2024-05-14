const { get } = require("mongoose");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongodbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");

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
            req.body.slug = slugify(req.body.title); // slugify dùng để chuyển giá trị của title thành slug
        }
        // (new: true) : một tùy chọn cho phép bạn trả về bản ghi đã được cập nhật thay vì bản ghi gốc trước khi cập nhật
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

// thêm sản phẩm vào yêu thích
const addWishList = asyncHandler(async (req, res) => {
    const { _id } = req.user; // trích xuất _id từ req.user
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id); // tìm kiếm một người dùng trong cơ sở dữ liệu dựa trên _id đã được trích xuất từ req.user
        const addWishList = user.wishlist.find( id => id.toString() === prodId); // kiểm tra sản phẩm đã có trong wishlist chưa
        if (addWishList) { // nếu prodId tồn tại thì loại bỏ prodId khỏi wishlist
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull : {wishlist: prodId}
                },
                {
                    new: true
                }
            )
            res.json(user);
        } else { // nếu prodId chưa tồn tại thì thêm prodId vào wishlist
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push : {wishlist: prodId}
                },
                {
                    new: true
                }
            )
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});

// đánh giá
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user; // trích xuất _id từ req.user
    const { star, prodId, comment } = req.body; // lấy star và prodId từ body
    try {
        const product = await Product.findById(prodId); // Tìm kiếm sản phẩm có id là prodId trong Product
        //Tìm kiếm xem người dùng đã đánh giá sản phẩm này trước đó chưa bằng cách so sánh _id với postedby trong mảng ratings
        let alreadyRated = product.ratings.find( userId => userId.postedby.toString() === _id.toString());
        // vd: alreadyRated = {
        //     star: 4,
        //     postedby: new ObjectId('6606206a587f0dd4b0146bfe'),
        //     _id: new ObjectId('66165d1145001683863185e8')
        //   }
        if (alreadyRated) { // kiểm tra người dùng đã đánh giá sản phẩm này chưa
            // nếu rồi thì Cập nhật đánh giá nếu người dùng đã đánh giá trước đó
            const updateRating = await Product.updateOne(
                {
                    // tìm kiếm trong mảng ratings mà trùng khớp với alreadyRated được truyền vào không
                    ratings: { $elemMatch: alreadyRated }
                },
                {
                    // ccập nhật thuộc tính star của phần tử đã tìm thấy trong mảng ratings với giá trị mới được truyền qua biến star
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment }
                },
                {
                    new: true
                }
            );
        }else{
            //Thêm đánh giá mới nếu người dùng chưa đánh giá trước đó
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    // push dùng để thêm đánh giá vào trong mảng ratings
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id
                        }
                    }
                },
                {
                    new: true
                }
            )
        }
        //Lấy lại thông tin của sản phẩm sau khi đã cập nhật hoặc thêm đánh giá
        const getAllRatings = await Product.findById(prodId);
        // Đếm số lượng đánh giá của sản phẩm
        let totalRatings = getAllRatings.ratings.length;
        //Tính tổng số sao của tất cả đánh giá của sản phẩm
        let ratingSum = getAllRatings.ratings
            //prev là giá trị tích lũy từ các lần lặp trước đó, ban đầu là 0.
            //curr là phần tử hiện tại trong mảng, tức là một điểm đánh giá.
            .map(item => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        //Tính điểm đánh giá trung bình của sản phẩm
        let actualRating = (ratingSum / totalRatings);
        //Cập nhật điểm đánh giá trung bình vào thông tin của sản phẩm
        let finalProduct = await Product.findByIdAndUpdate(
            prodId,
            {
                // gán actualRating vào totalrating trong Product
                totalrating: actualRating
            },
            {
                new: true
            }
        );
        res.json(finalProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
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
        const findProduct = await Product.findByIdAndUpdate(
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
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createProduct,
    getAllProduct,
    getAProduct,
    updateAProduct,
    deleteProduct,
    addWishList,
    rating,
    uploadImages
};