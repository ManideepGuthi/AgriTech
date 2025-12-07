import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    console.log("Testing gemini-1.5-flash-8b...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(`SUCCESS: gemini-1.5-flash-8b responded: ${response.text()}`);
    } catch (error) {
        console.log(`FAILED: gemini-1.5-flash-8b - Error: ${error.message}`);
    }
}

run();
