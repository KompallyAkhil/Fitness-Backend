import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import signup from "./Routes/Login.js";
import register from "./Routes/Register.js";
import chat from "./Routes/Chat.js"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.options('*', cors());
const allowedOrigins = ["http://localhost:3000","https://fitness-bot-lilac.vercel.app"]
app.use(cors({
    origin:allowedOrigins,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    credentials: true,
}));
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
        console.log("Database Connected!!");
    } catch (error) {
        console.error("Database Connection Error:", error);
    }
})();
app.use('/SignIn', signup);
app.use('/Register', register);
app.use('/chat',chat);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
