import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const modelName = "gemini-1.5-flash";

async function run() {
    console.log(`Testing ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(`SUCCESS: ${modelName} responded: ${response.text()}`);
    } catch (error) {
        console.log(`FAILED: ${modelName} - Error: ${error.message}`);
    }
}

run();
