
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DiseaseAnalysis, LandAnalysisResult, YieldEstimate, GovtScheme, Language } from "../types";
import {
  MOCK_DISEASE_ANALYSIS,
  MOCK_FARMING_ADVICE,
  MOCK_LAND_ANALYSIS,
  MOCK_YIELD_ESTIMATE,
  MOCK_GOVT_SCHEMES
} from "./mockData";

// Models to try in order of preference
const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-flash-latest",
  "gemini-pro-latest"
];

const getAiClient = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    console.error("VITE_API_KEY is missing/empty in .env");
    return new GoogleGenerativeAI("missing_api_key");
  }
  return new GoogleGenerativeAI(apiKey);
};

// Helper to get language name
const getLangName = (l: Language) => {
  switch (l) {
    case 'hi': return 'Hindi';
    case 'kn': return 'Kannada';
    case 'te': return 'Telugu';
    default: return 'English';
  }
};

/**
 * Generic function to make AI requests with Model Fallback and Mock Fallback
 */
async function makeModelRequest<T>(
  prompt: string | any[],
  fallbackData: T,
  parser?: (text: string) => T
): Promise<T> {
  const ai = getAiClient();
  let lastError: any = null;

  for (const modelName of MODELS) {
    try {
      const model = ai.getGenerativeModel({ model: modelName });
      console.log(`Making AI Request with model: ${modelName}`);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (parser) {
        return parser(text);
      }
      return text as unknown as T;

    } catch (error: any) {
      lastError = error;
      const status = error.status || 'Unknown Status';
      const msg = error.message || 'Unknown Error';

      const isRateLimit = msg.includes('429') || status === 429;
      const isQuotaExceeded = msg.includes('403') || status === 403;
      const isOverloaded = msg.includes('503') || status === 503;
      const isNotFound = msg.includes('404') || status === 404;

      if (isRateLimit || isQuotaExceeded || isOverloaded || isNotFound) {
        console.warn(`Model ${modelName} failed (${status}). Msg: ${msg}. Trying next...`);
        continue;
      }

      console.error(`Model ${modelName} general error:`, error);
      continue;
    }
  }

  // If all models failed
  console.error("All AI models failed. Falling back to MOCK DATA.", lastError);
  console.warn("Using Offline/Mock Data due to API Limits.");

  // Ensure fallback data has a unique ID if it's an object with an ID
  if (fallbackData && typeof fallbackData === 'object' && 'id' in fallbackData) {
    return { ...fallbackData, id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
  }

  return fallbackData;
}

// --- Exported API Functions ---

// Helper to convert base64 to Blob for FormData
const base64ToBlob = (base64: string): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

export const analyzeCropImage = async (base64Image: string, lang: Language = 'en'): Promise<DiseaseAnalysis> => {
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
  let customDiagnosis: string | null = null;
  let customConfidence: number = 0;

  // 1. Try Local Python Model
  try {
    const formData = new FormData();
    formData.append('image', base64ToBlob(base64Image));

    console.log("Attempting to connect to Local Python Model...");
    const localResponse = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: formData,
    });

    if (localResponse.ok) {
      const data = await localResponse.json();
      console.log("Local Model Result:", data);

      if (data.class) {
        customDiagnosis = data.class;
        customConfidence = data.confidence || 0.85;
      }
    } else {
      console.warn("Local model returned error:", localResponse.status);
    }
  } catch (err) {
    console.warn("Local Python Model unavailable (using cloud fallback):", err);
  }

  // 2. Construct Prompt (Hybrid or Fallback)
  let prompt = "";
  if (customDiagnosis) {
    // Hybrid: Local Model gave diagnosis, Gemini gives details
    prompt = `
    CONTEXT: A specialized Millet Disease Model has analyzed this image and detected: "${customDiagnosis}".
    
    TASK: Provide a detailed report for "${customDiagnosis}" in Millets.
    
    OUTPUT: Provide response in ${getLangName(lang)}. Return JSON strictly matching the format below.
    - Set "diagnosis" to "${customDiagnosis}".
    - Set "confidence" to ${customConfidence.toFixed(2)}.
    - Provide "treatment", "prevention", "interventionPlan".
    - If "${customDiagnosis}" is "Healthy", provide tips for maintaining health.
    
    RETURN JSON FORMAT:
    {
      "isPlant": true,
      "plantName": "Millet", 
      "diagnosis": "${customDiagnosis}", 
      "confidence": number, 
      "description": string, 
      "severity": "Low" | "Medium" | "High", 
      "interventionPlan": [{ "day": string, "action": string }], 
      "treatment": [string], 
      "prevention": [string]
    }
    `;
  } else {
    // Fallback: Pure Gemini Analysis (Original Prompt Logic)
    prompt = `
      IMPORTANT: You are an expert Agricultural AI specializing in Indian Millet crops (Bajra, Jowar, Ragi).
      
      TASK: Analyze the provided image and generate a diagosis JSON.
      
      STEPS:
      1. **IS IT A CROP?**: First, strictly determine if the image contains a plant, leaf, crop, or farm field. 
         - If the image contains random objects (chair, person, car, laptop, generic wall), set "isPlant" to false.
         - If "isPlant" is false, return the JSON with "description": "No crop or plant detected. Please upload a clear image of a plant leaf or farm." and stop there.
      
      2. **CROP IDENTIFICATION**: If it is a plant, check if it is a Millet variety (Pearl Millet/Bajra, Finger Millet/Ragi, Sorghum/Jowar). 
         - If it is a different plant, note that in "plantName" but proceed with general diagnosis.
         
      3. **DISEASE DIAGNOSIS**: Look for specific diseases: Downy Mildew, Blast, Rust, Ergot, Smut, Armyworm.
         
      4. **OUTPUT**: Provide the response STRICTLY in ${getLangName(lang)} language.
      
      RETURN JSON FORMAT:
      {
        "isPlant": boolean,
        "plantName": string, 
        "diagnosis": string, 
        "confidence": number, 
        "description": string, 
        "severity": "Low" | "Medium" | "High", 
        "interventionPlan": [{ "day": string, "action": string }], 
        "treatment": [string], 
        "prevention": [string]
      }
    `;
  }

  // 3. Execute Request with Robust Fallback
  try {
    return await makeModelRequest<DiseaseAnalysis>(
      [
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanBase64,
          },
        },
      ],
      { ...MOCK_DISEASE_ANALYSIS, timestamp: Date.now() }, // Default Fallback
      (text) => {
        const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        parsed.id = Date.now().toString();
        parsed.timestamp = Date.now();
        return parsed;
      }
    );
  } catch (apiError) {
    // If Gemini fails but we have a Local Diagnosis, USE IT!
    if (customDiagnosis) {
      console.log("Cloud API failed, but Local Model succeeded. Generating offline report.");
      return {
        id: `local-${Date.now()}`,
        userId: "local-user",
        timestamp: Date.now(),
        isPlant: true,
        plantName: "Millet",
        diagnosis: customDiagnosis,
        confidence: customConfidence,
        description: `Visual analysis detected indicators of ${customDiagnosis}. Cloud detailed analysis is currently unavailable.`,
        severity: "Medium",
        interventionPlan: [
          { day: "Day 1", action: "Isolate affected plants." },
          { day: "Day 3", action: "Consult local agriculture expert for specific fungicide." }
        ],
        treatment: ["Apply appropriate fungicide", "Improve air circulation"],
        prevention: ["Use resistant seeds", "Maintain proper spacing"]
      };
    }
    throw apiError; // Re-throw if we have nothing
  }
};

export const getFarmingAdvice = async (query: string): Promise<string> => {
  return makeModelRequest<string>(
    `You are an expert millet farming consultant. Reply in the language of the user's query or default to English. ${query}`,
    MOCK_FARMING_ADVICE
  );
};

export const analyzeLand = async (
  soilType: string,
  ph: string,
  location: string,
  size: string,
  waterSource: string,
  lang: Language = 'en'
): Promise<LandAnalysisResult> => {
  const prompt = `Analyze land for Millets. Soil: ${soilType}, pH: ${ph}, Location: ${location}, Size: ${size}, Water Source: ${waterSource}. Response in ${getLangName(lang)}. Return JSON with: suitabilityScore (number 0-100), suitableCrops (array of strings), soilImprovements (array of strings), waterAnalysis (string), rotationRecommendation (array of strings), summary (string).`;

  return makeModelRequest<LandAnalysisResult>(
    prompt,
    { ...MOCK_LAND_ANALYSIS, timestamp: Date.now() },
    (text) => {
      const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      parsed.id = Date.now().toString();
      parsed.timestamp = Date.now();
      return parsed;
    }
  );
};

export const calculateYieldPotential = async (crop: string, area: string, lang: Language = 'en'): Promise<YieldEstimate> => {
  const prompt = `Calculate yield/profit for ${crop} on ${area} acres in India. Response in ${getLangName(lang)}. Return JSON with: crop (string), estimatedYield (string), estimatedIncome (string), cultivationCost (string), profitMargin (string), tips (array of strings).`;

  return makeModelRequest<YieldEstimate>(
    prompt,
    MOCK_YIELD_ESTIMATE,
    (text) => {
      const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleaned);
    }
  );
};

export const findGovernmentSchemes = async (): Promise<GovtScheme[]> => {
  const prompt = "List 4 key Indian Govt schemes for Millet Farming. Return JSON array with each item having: name (string), benefits (string), eligibility (string).";

  return makeModelRequest<GovtScheme[]>(
    prompt,
    MOCK_GOVT_SCHEMES,
    (text) => {
      const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleaned);
    }
  );
};
