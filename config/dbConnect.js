const { default: mongoose } = require("mongoose")

const dbConnect = () =>{
    try{
        const conn = mongoose.connect(process.env.MONGODB);
        console.log("database connect successfully");
    }catch(error){
        throw new Error(error);
        console.log("database error");
    }
}
module.exports=dbConnect;