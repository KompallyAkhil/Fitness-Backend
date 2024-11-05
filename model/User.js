import mongoose from "mongoose";
const loginSchema = new mongoose.Schema({
    Username :{
        type : String,
        required : true,
        unique : true
    },
    EmailID : {
        type: String,
        required: true, 
        unique: true,
    },
    Password:{
        type:String,
        required:true,
    }
},{collection:"FitBot"})
const Login = mongoose.model('Login',loginSchema);
export default Login;