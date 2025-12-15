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

    const prompt = `Analyze this image carefully. You are an expert plant pathologist.
    
    Step 1: Determine if the image contains a plant, crop, leaf, or agricultural scene.
    - If NO (e.g., airplane, car, person only, building, random object): Return "isPlant": false.
    - If YES: Return "isPlant": true and proceed to Step 2.

    Step 2 (Only if isPlant is true):
    - Identify the specific plant name.
    - Diagnose any disease, pest, or deficiency.
    - If the plant looks healthy, diagnose as "Healthy Crop".
    - Provide a detailed list of symptoms observed.
    - Recommend practical treatments and preventive measures.
    - Create a short intervention plan.

    Respond ONLY in ${lang}.
    
    Return a STRICT JSON object with this structure:
    {
      "isPlant": boolean,
      "diagnosis": "Disease Name or Healthy Crop (if isPlant is true) OR 'Not a crop' (if isPlant is false)",
      "confidence": number (0-1),
      "plantName": "Name of the plant (or 'Unknown' if not a plant)",
      "description": "Brief explanation of findings",
      "symptoms": ["symptom1", "symptom2"],
      "treatment": ["treatment1", "treatment2"],
      "prevention": ["prevention1", "prevention2"],
      "interventionPlan": [{ "day": "Day 1", "action": "action description" }]
    }`;

    const groq = getGroqClient();
    const response = await groq.chat.completions.create({
      model: "llama-3.2-90b-vision-preview",
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
