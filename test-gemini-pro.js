import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    console.log("Testing gemini-pro...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(`SUCCESS: gemini-pro responded: ${response.text()}`);
    } catch (error) {
        console.log(`FAILED: gemini-pro - Error: ${error.message}`);
    }
}

run();
