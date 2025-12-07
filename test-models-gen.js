import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.VITE_API_KEY;
if (!apiKey) {
    console.error("API Key missing");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey.trim());

const modelsToTest = [
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-pro-latest",
    "gemini-1.5-flash-latest", // Trying explicit latest
    "gemini-1.5-pro-latest"
];

async function testModel(modelName) {
    console.log(`\n--- Testing ${modelName} ---`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hi");
        const response = await result.response;
        console.log(`[SUCCESS] ${modelName}:`, response.text().substring(0, 50));
        return true;
    } catch (error) {
        console.log(`[FAILED] ${modelName}: ${error.statusText || error.message}`);
        return false;
    }
}

async function run() {
    for (const m of modelsToTest) {
        if (await testModel(m)) {
            console.log(`\n>>> FOUND WORKING MODEL: ${m} <<<`);
            break;
        }
    }
}

run();
