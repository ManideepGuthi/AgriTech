
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';

// Manually parse env file
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');
let apiKey = process.env.VITE_API_KEY;

function parseEnv(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
            const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                // Remove quotes if present
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                process.env[key] = value;
            }
        }
        return process.env.VITE_API_KEY;
    } catch (e) {
        console.error("Error reading env file:", e.message);
        return null;
    }
}

if (!apiKey) {
    if (fs.existsSync(envLocalPath)) {
        console.log(`Reading from ${envLocalPath}`);
        apiKey = parseEnv(envLocalPath);
    } else if (fs.existsSync(envPath)) {
        console.log(`Reading from ${envPath}`);
        apiKey = parseEnv(envPath);
    }
}

if (!apiKey) {
    console.error("❌ VITE_API_KEY is missing in environment variables.");
    process.exit(1);
}

console.log(`🔑 Using API Key: ${apiKey.substring(0, 5)}...`);

const genAI = new GoogleGenerativeAI(apiKey);

// List of models to test
const modelsToTest = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash-latest"
];

async function run() {
    console.log("🚀 Starting Model Verification...");

    for (const modelName of modelsToTest) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            // Simple text prompt to check if model is accessible
            const result = await model.generateContent("Say 'OK' if you can hear me.");
            const response = await result.response;
            const text = response.text();
            console.log(`✅ SUCCESS`);
        } catch (error) {
            console.log(`❌ FAILED (${error.status || 'Unknown Status'}: ${error.message?.split('\n')[0]})`);
        }
    }
}

run();
