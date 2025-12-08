import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const models = [
    "gemini-1.5-flash",
    "gemini-1.5-pro"
];

async function run() {
    for (const modelName of models) {
        console.log(`Testing ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you there?");
            const response = await result.response;
            console.log(`SUCCESS: ${modelName} responded: ${response.text()}`);
        } catch (error) {
            console.log(`FAILED: ${modelName} - Error: ${error.message}`);
        }
    }
}

run();
