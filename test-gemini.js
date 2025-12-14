import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.VITE_API_KEY;

if (!apiKey) {
    console.error("Error: VITE_API_KEY is not set in .env file");
    process.exit(1);
}

console.log(`API Key length: ${apiKey.length}`);
if (apiKey.length > 10) {
    console.log(`API Key starts with: ${apiKey.substring(0, 5)}...`);
    console.log(`API Key ends with: ...${apiKey.substring(apiKey.length - 5)}`);
} else {
    console.log(`API Key is too short: ${apiKey}`);
}

const genAI = new GoogleGenerativeAI(apiKey.trim());
// Testing standard flash model (not exp) to avoid 429/403
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite-preview-02-05" });

async function run() {
    try {
        console.log("Testing Gemini API with model: gemini-2.0-flash");
        const prompt = "Hello, apply concise response.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Success! Response:", text);
    } catch (error) {
        console.error("Error testing Gemini API:");
        console.error(error.message);
    }
}

run();
