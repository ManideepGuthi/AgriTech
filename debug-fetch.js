import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.VITE_API_KEY;

if (!apiKey) {
    console.log("API Key is MISSING");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Fetching: ${url.replace(apiKey, "HIDDEN_KEY")}`);

async function run() {
    try {
        const response = await fetch(url);
        console.log(`Status: ${response.status} ${response.statusText}`);
        const data = await response.json();
        if (data.models) {
            const fs = await import('fs');
            const modelNames = data.models.map(m => m.name).join('\n');
            fs.writeFileSync('models.txt', modelNames);
            console.log("Wrote models to models.txt");
        } else {
            console.log("No models found or error structure:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

run();
