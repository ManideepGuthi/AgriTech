import dotenv from "dotenv";
import { exec } from "child_process";

dotenv.config();

const apiKey = process.env.VITE_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Querying: ${url.replace(apiKey, "HIDDEN_KEY")}`);

exec(`curl "${url}"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});
