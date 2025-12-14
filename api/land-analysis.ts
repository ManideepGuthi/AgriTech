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
    const {
      soilType,
      ph,
      location,
      size,
      waterSource,
      lang = "English",
    } = req.body;

    const prompt = `Analyze farmland for millet farming. 
    Context:
    - Soil type: ${soilType}
    - pH: ${ph}
    - Location: ${location}
    - Size: ${size} acres
    - Water source: ${waterSource}
    
    Respond ONLY in ${lang}.
    Return a STRICT JSON object with the following structure:
    {
      "suitabilityScore": number (0-100),
      "suitableCrops": ["crop1", "crop2"],
      "soilImprovements": ["improvement1"],
      "waterAnalysis": "analysis text",
      "rotationRecommendation": ["crop1", "crop2"],
      "summary": "summary text"
    }`;

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
      res.json(parsed);
    } catch (parseError) {
      console.warn("Failed to parse generated text as JSON");
      console.log("Raw content:", content);
      res.status(500).json({ error: "Invalid response format from AI" });
    }
  } catch (err) {
    console.error("Land Analysis Error:", err);
    res.status(500).json({ error: "Failed to analyze land" });
  }
});

export default router;
