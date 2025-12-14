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
    const prompt = `List 4 key Indian government schemes for Millet Farming. 
    Return a STRICT JSON array with the following structure: 
    [{"name": "Scheme Name", "benefits": "Benefits description", "eligibility": "Eligibility criteria"}]`;

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
      // Sometimes the model returns an object with a key like "schemes": [...] instead of just [...]
      // Or it might return { "schemes": [...] }
      const parsed = JSON.parse(content);
      
      let schemes = [];
      if (Array.isArray(parsed)) {
        schemes = parsed;
      } else if (parsed.schemes && Array.isArray(parsed.schemes)) {
        schemes = parsed.schemes;
      } else {
         // Fallback: try to find the first array in the object values
         const values = Object.values(parsed);
         const arrayVal = values.find(v => Array.isArray(v));
         if (arrayVal) schemes = arrayVal;
      }

      if (schemes.length === 0) throw new Error("No schemes found in response");

      res.json(schemes);
    } catch (parseError) {
      console.warn("Failed to parse generated text as JSON, using fallback");
      const fallback = [
        {
          "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
          "benefits": "Provides financial support to farmers in case of crop failure due to natural calamities, pests, and diseases.",
          "eligibility": "All farmers growing notified crops in notified areas are eligible."
        },
        {
          "name": "National Agriculture Market (eNAM)",
          "benefits": "Provides a unified national market for agricultural commodities with better price discovery.",
          "eligibility": "Farmers, traders, and buyers registered on the eNAM platform."
        },
        {
          "name": "Soil Health Card Scheme",
          "benefits": "Provides soil health cards to farmers with recommendations for soil management.",
          "eligibility": "All farmers in India."
        },
        {
          "name": "Paramparagat Krishi Vikas Yojana (PKVY)",
          "benefits": "Promotes organic farming practices and provides financial assistance for organic inputs.",
          "eligibility": "Farmers interested in organic farming."
        }
      ];
      res.json(fallback);
    }
  } catch (err) {
    console.error("Govt Schemes Error:", err);
    res.status(500).json({ error: "Failed to fetch government schemes" });
  }
});

export default router;
