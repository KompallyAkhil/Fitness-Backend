import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {GoogleGenerativeAI} from "@google/generative-ai"
import mongoose from "mongoose";
import Login from "./model/User.js";
import bcrypt from "bcrypt";
const app = express();
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json());
app.options('*', cors());
const allowedOrigins = ["http://localhost:3000","https://fitness-bot-lilac.vercel.app"]
app.use(cors({
    origin:allowedOrigins,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    credentials: true,
}));
(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
        console.log("Database Connected !!");
    } catch (error) {
        console.log("Error Occurred" + error)
    }
})();


async function askQuestion(UserInput){
    try{
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `
        The user has asked the following question: ${UserInput}. 

        Respond if the question falls under any of these categories:
        1. **Workouts**: This includes exercise routines, tips for specific muscle groups, fitness advice, or guidance for achieving fitness goals.
        2. **Meal Plans**: This covers diet plans, healthy recipes, meal suggestions, or personalized nutrition strategies.
        3. **Nutritional Information**: Questions like "What nutrients are in eggs?" or "How much protein does a banana have?" related to food composition, calorie counts, or health benefits.

        If the user asks for a video reference, include a link to a relevant video resource (if available).

        For all fitness-related queries, provide a concise and accurate response. If the question does not pertain to workouts, meal plans, or nutrition, respond with:
        "I specialize in questions about workouts, meal plans, and food nutrition. Please refine your query accordingly."

        Keep responses friendly, professional, and directly relevant to the user's input.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text()
    }
    catch(error){
        console.log(error)
    }
}

app.post('/Register', async (req, res) => {
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
        return res.status(409).json({message : "Password does not match"})
    }
    if(Password.length < 7){
        return res.status(409).json({message : "Password is too short"})
    }
    const hashedPassword = await bcrypt.hash(Password,10);

    const newUserRegister = new Login({Username,EmailID,Password:hashedPassword});

    await newUserRegister.save()
 
    res.json({ message: "User registered successfully!" }); 
});
app.post('/SignIn', async (req,res)=>{
    const {Username,Password} = req.body;
    if(!Username || !Password){
        return res.status(409).json({message : "Usaername or Password cannot be empty"})
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
})
app.get('/chat',async (req,res)=>{
    const name = req.query.text;
    try {
        const responseText = await askQuestion(name);
        res.json({response:responseText})
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})
