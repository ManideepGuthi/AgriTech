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
    const { state = "India" } = req.body;

    const prompt = `Provide current agricultural market prices for 4-5 major crops in ${state}, India.
    Include crops like Millet, Rice, Wheat, Cotton, etc., relevant to the region.
    Respond ONLY in JSON format.
    Structure:
    [
      { "crop": "Crop Name", "price": number (price per quintal in INR), "trend": "up" | "down" | "stable", "change": number (change amount) }
    ]
    Ensure prices are realistic for the current market conditions in India.`;

    const groq = getGroqClient();
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from Groq API");
    }

    try {
      const parsed = JSON.parse(content);
      // Handle if it returns { "prices": [...] } or just [...]
      let prices = [];
      if (Array.isArray(parsed)) {
        prices = parsed;
      } else if (parsed.prices && Array.isArray(parsed.prices)) {
        prices = parsed.prices;
      } else {
         // Fallback: try to find the first array in the object values
         const values = Object.values(parsed);
         const arrayVal = values.find(v => Array.isArray(v));
         if (arrayVal) prices = arrayVal;
      }

      if (!prices || prices.length === 0) {
        throw new Error("Invalid format");
      }
      
      res.json(prices);
    } catch (parseError) {
      console.warn("Failed to parse market prices JSON", parseError);
      res.status(500).json({ error: "Failed to fetch market prices" });
    }
  } catch (err) {
    console.error("Market Prices Error:", err);
    res.status(500).json({ error: "Failed to fetch market prices" });
  }
});

export default router;
