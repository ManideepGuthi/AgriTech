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
    const { image, lang = "English" } = req.body; // image is base64 string

    if (!image) {
        return res.status(400).json({ error: "Image data is required" });
    }

    // Ensure image is data url
    const imageUrl = image.startsWith("data:image") ? image : `data:image/jpeg;base64,${image}`;

    const prompt = `Analyze this crop image. Identify any diseases or pests. 
    If healthy, say "Healthy Crop".
    Provide a diagnosis and confidence level.
    Respond ONLY in ${lang}.
    Return a STRICT JSON object:
    {
      "diagnosis": "Disease Name or Healthy Crop",
      "confidence": number (0-1),
      "symptoms": ["symptom1", "symptom2"],
      "treatment": ["treatment1", "treatment2"],
      "prevention": ["prevention1", "prevention2"],
      "interventionPlan": [{ "day": "Day 1", "action": "action description" }, { "day": "Day 3", "action": "follow up" }]
    }`;

    const groq = getGroqClient();
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ],
        },
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from Groq API");
    }

    const parsed = JSON.parse(content);
    res.json(parsed);

  } catch (err: any) {
    console.error("Image Analysis Error:", err);
    res.status(500).json({ error: "Failed to analyze image", details: err.message });
  }
});

export default router;
