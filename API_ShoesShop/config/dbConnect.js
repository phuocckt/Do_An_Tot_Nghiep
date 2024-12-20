const { default: mongoose } = require("mongoose")

const dbConnect = () =>{
    try{
        const conn = mongoose.connect(process.env.MODULE_URL);
        console.log("Database connected successfully");
    }
    catch(err){
        console.log("Database error");
    }
}
module.exports = dbConnect;