import express, { Request, Response } from "express";

const router = express.Router();

const getGroqClient = async () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }
  const { default: Groq } = await import("groq-sdk");
  return new Groq({ apiKey });
};

const cleanJSON = (text: string) => {
  let cleaned = text.replace(/```json|```/g, "").trim();
  // Sometimes models return text before or after the JSON
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
};

router.post("/", async (req: Request, res: Response) => {
  try {
    const { crop, area, lang = "English" } = req.body;

    const prompt = `
Calculate yield/profit for ${crop} on ${area} acres in India.
Respond ONLY in ${lang}.
Return a STRICT JSON object with the following structure:
{
  "crop": string,
  "estimatedYield": string,
  "estimatedIncome": string,
  "cultivationCost": string,
  "profitMargin": string,
  "tips": string[]
}
`;

    const groq = await getGroqClient();
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
      // Fix potential JSON issues if the model returns Markdown code blocks
      const cleanedContent = cleanJSON(content);
      const parsedContent = JSON.parse(cleanedContent);
      res.json(parsedContent);
    } catch (parseError) {
      console.error("JSON Parse Error in Yield Estimate:", parseError);
      console.error("Raw LLM content:", content);
      
      // Retry logic or use regex to extract JSON
      try {
          const match = content.match(/\{[\s\S]*\}/);
          if (match) {
              const extracted = JSON.parse(match[0]);
              return res.json(extracted);
          }
      } catch (e) {
         console.error("Regex extraction failed");
      }

      console.warn("Failed to parse yield estimate response");
      res.status(500).json({ error: "Failed to generate valid yield estimate" });
    }
  } catch (err) {
    console.error("Yield Estimate Error:", err);
    res.status(500).json({ error: "Failed to calculate yield" });
  }
});

export default router;
