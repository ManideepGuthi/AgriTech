import express, { Request, Response } from "express";
import { Groq } from "groq-sdk";

const router = express.Router();

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }
  return new Groq({ apiKey });
};

router.post("/", async (req: Request, res: Response) => {
  try {
    const { message = "Hello" } = req.body;

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          "role": "user",
          "content": message
        }
      ]
    });

    res.json({ response: completion.choices[0].message.content || "Sorry, I couldn't generate a response." });
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: "Error generating response", details: err.message });
  }
});

export default router;
