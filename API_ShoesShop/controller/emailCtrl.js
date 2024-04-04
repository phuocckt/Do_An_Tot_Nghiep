const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, req, res) => {
    let transporter = nodemailer.createTransport({ //dùng để sử dụng để gửi mail
        host: "smtp.gmail.com", //đây là gmail's SMTP của server để sử dụng thông qua cổng 587
        port: 587,
        secure: false, // Sử dụng 'true' cho cổng 465, 'false' cho tất cả các cổng khác
        auth: { // xác thực tài khoản gửi gmail
          user: "vhnp177@gmail.com",
          pass: "ffwi mrhl jxpf kriw",
        },
    });
    let info = await transporter.sendMail({ // dùng để gửi mail
        //from: '"Hey " <tranbinhbinh.2005vta@gmail.com>', // địa chỉ người gửi
        to: data.to, // Danh sách người nhận
        subject: data.subject, // Dòng chủ đề
        text: data.text, // Nội dung văn bản
        html: data.htm, // Nội dung html
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
});

module.exports = { sendEmail };