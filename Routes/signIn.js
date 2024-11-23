import express from "express";
import Login from "../model/User.js";
import bcrypt from "bcrypt";
const router = express.Router();
router.post('/',async (req,res)=>{
    try {
        const {Username,Password} = req.body;
        if(!Username || !Password){
            return res.status(409).json({message : "Username or Password cannot be empty"})
        }
        const findUser = await Login.findOne({Username});
        if(!findUser){
            return res.status(409).json({message:"User not found"});
        }
        const findPassword = await bcrypt.compare(Password,findUser.Password);
        if(findPassword){
            return res.json({loginUsername : Username,loginStatus:true});
        }
        else{
            return res.status(409).json({message:"Incorrect Password"});
        }
    } catch (error) {
        console.error(error)
        return res.status(409).json({message:"Error"});
    }
})
export default router;