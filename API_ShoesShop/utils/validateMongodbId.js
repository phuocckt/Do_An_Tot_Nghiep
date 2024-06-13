// const mongoose = require("mongoose");

// const validateMongodbId = (id) => {
//     //Sử dụng phương thức isValid() của đối tượng mongoose.Schema.Types.ObjectId để kiểm tra xem chuỗi id có phải là một ObjectId hợp lệ không
//     const isValid = mongoose.Schema.Types.ObjectId.isValid(id);
//     //Nếu isValid là false, điều này ngụ ý rằng id không phải là một ObjectId hợp lệ
//     if (!isValid) throw new Error("This id isn't valid or not Found");
// };

// module.exports = validateMongodbId;