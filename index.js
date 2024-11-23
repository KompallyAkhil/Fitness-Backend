import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {GoogleGenerativeAI} from "@google/generative-ai"
import mongoose from "mongoose";
const app = express();
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json());
app.options('*', cors());
import signIn from "./Routes/signin.js";
import Register from "./Routes/Register.js";
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
        const prompt = `The user has asked a question: ${UserInput}. Respond if the question relates to workouts (such as exercise routines, tips for specific muscle groups, or fitness advice), meal plans (including diet plans, meal suggestions, or healthy recipes), or nutritional information about foods (like "What nutrients are in eggs?" or "How much protein does a banana have?"). Provide a brief and relevant answer to fitness-related queries also provide video reference if user asked, and if the question is not related to workouts, meals, or nutrition, respond with "I can assist only with questions about workouts, meal plans, and food nutrition."`;
        const result = await model.generateContent(prompt);
        return result.response.text()
    }
    catch(error){
        console.log(error)
    }
}
app.use('/SignIn',signIn);
app.use('/Register',Register);
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
