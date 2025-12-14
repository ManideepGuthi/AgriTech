import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const models = [
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash-lite-preview-02-05"
];

async function run() {
    for (const modelName of models) {
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
}

run();
