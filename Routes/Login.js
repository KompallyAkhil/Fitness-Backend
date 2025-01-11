import express from "express";
import Login from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();
const SECRET_KEY = "@#$%#&*(^$%^&*";
router.post('/', async(req,res) => {
    const {Username,Password} = req.body;
    if(!Username || !Password){
        return res.status(409).json({message : "Username or Password cannot be empty"})
    }
    const findUser = await Login.findOne({Username});
    if(!findUser){
        return res.status(409).json({message:"User not found"});
    }
    const findPassword = await bcrypt.compare(Password,findUser.Password);
    if(!findPassword){
        return res.status(409).json({message:"Invalid Password"});
    }
    const token = jwt.sign({Username},SECRET_KEY,{expiresIn:"1hr"});
    res.json({token,loginStatus:true});
})
export default router;