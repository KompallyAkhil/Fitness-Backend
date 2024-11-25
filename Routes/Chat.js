import express from "express";
const router = express.Router();
import {GoogleGenerativeAI} from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
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
router.get('/',async(req,res)=>{
    const name = req.query.text;
    try {
        const responseText = await askQuestion(name);
        res.json({response:responseText})
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }

})
export default router;