import dotenv from 'dotenv';
dotenv.config();

const requiredKeys = [
    'GROQ_API_KEY',
    'MONGODB_URI'
];

const optionalKeys = [
    'OPENAI_API_KEY',
    'HF_API_KEY',
    'VITE_HF_API_KEY',
    'GEMINI_API_KEY'
];

console.log("Checking Environment Variables...");
let missing = false;

console.log("\nRequired Keys:");
requiredKeys.forEach(key => {
    if (process.env[key]) {
        console.log(`✅ ${key} is present.`);
    } else {
        console.log(`❌ ${key} is MISSING.`);
        missing = true;
    }
});

console.log("\nOptional Keys (Not currently used):");
optionalKeys.forEach(key => {
    if (process.env[key]) {
        console.log(`✅ ${key} is present.`);
    } else {
        console.log(`⚠️ ${key} is missing (but optional).`);
    }
});


if (missing) {
    console.log("\nSome keys are missing. Please update your .env file.");
} else {
    console.log("\nAll required keys are present.");
}
