import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.VITE_API_KEY;

console.log("--- DEBUG START ---");
if (!apiKey) {
    console.log("API Key is MISSING or EMPTY");
} else {
    console.log(`API Key Length: ${apiKey.length}`);
    console.log(`First 5 chars: '${apiKey.substring(0, 5)}'`);
    console.log(`Last 5 chars: '${apiKey.substring(apiKey.length - 5)}'`);
    console.log(`Is trimmed? ${apiKey.trim() === apiKey}`);

    // Check for common issues
    if (apiKey.includes('"')) console.log("WARNING: Key contains quotes");
    if (apiKey.includes("'")) console.log("WARNING: Key contains quotes");
    if (apiKey.includes(" ")) console.log("WARNING: Key contains spaces");
}
console.log("--- DEBUG END ---");
