import Login from "../model/User.js";
import bcrypt from "bcrypt";
import express from "express";
const router = express.Router();
router.post('/',async(req,res)=>{
    const { Username, EmailID, Password , ConfirmPassword } = req.body;
    if(!Username || !EmailID || !Password){
        return res.status(409).json({message : "Incomplete Information"});
    }
    const newUser = await Login.findOne({Username}); 
    if(newUser){ 
        return res.status(409).json({message:"Username already exists"});
    }
    const newEmail = await Login.findOne({EmailID});
    if(newEmail){
        return res.status(409).json({message:"Email already taken"});
    }
    if(Password !== ConfirmPassword){
        return res.status(409).json({message : "Password does not match"});
    }
    if(Password.length < 7){
        return res.status(409).json({message : "Password is too short"});
    }
    const hashedPassword = await bcrypt.hash(Password,10); 
    const newUserRegister = new Login({Username,EmailID,Password:hashedPassword});
    await newUserRegister.save()
    res.json({ message: "User registered successfully!" });  
});
export default router;