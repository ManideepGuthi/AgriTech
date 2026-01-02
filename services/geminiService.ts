import {
  DiseaseAnalysis,
  LandAnalysisResult,
  YieldEstimate,
  GovtScheme,
  Language
} from "../types";

<<<<<<< HEAD
=======
import OpenAI from "openai";
import { DiseaseAnalysis, LandAnalysisResult, YieldEstimate, GovtScheme, Language } from "../types";
>>>>>>> d4575e9 (Feature Update)
import {
  MOCK_DISEASE_ANALYSIS,
  MOCK_FARMING_ADVICE,
  MOCK_LAND_ANALYSIS,
  MOCK_YIELD_ESTIMATE,
  MOCK_GOVT_SCHEMES
} from "./mockData";

<<<<<<< HEAD
/* =========================
   HELPERS
========================= */

=======
const MODEL = "nex-agi/deepseek-v3.1-nex-n1:free";
const API_KEY = "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";

const getAiClient = () => {
  return new OpenAI({
    apiKey: API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  });
};

// Helper to get language name
>>>>>>> d4575e9 (Feature Update)
const getLangName = (l: Language) => {
  switch (l) {
    case "hi": return "Hindi";
    case "kn": return "Kannada";
    case "te": return "Telugu";
    default: return "English";
  }
};

<<<<<<< HEAD
const cleanJSON = (text: string) =>
  text.replace(/```json|```/g, "").trim();

const HF_API = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base";

/* =========================
   IMAGE ANALYSIS (Frontend safe)
========================= */

export const analyzeCropImage = async (
  base64Image: string,
  lang: Language = "en"
): Promise<DiseaseAnalysis> => {
=======
/**
 * Generic function to make AI requests with OpenRouter and Mock Fallback
 */
async function makeModelRequest<T>(
  messages: any[],
  fallbackData: T,
  parser?: (text: string) => T
): Promise<T> {
  const openrouter = getAiClient();

  try {
    console.log(`Making AI Request with model: ${MODEL}`);

    const response = await openrouter.chat.completions.create({
      model: MODEL,
      messages: messages,
      stream: false
    });

    const text = response.choices[0]?.message?.content || '';

    if (parser) {
      return parser(text);
    }
    return text as unknown as T;

  } catch (error: any) {
    console.error("OpenRouter request failed:", error);
    console.warn("Using Offline/Mock Data due to API failure.");

    // Ensure fallback data has a unique ID if it's an object with an ID
    if (fallbackData && typeof fallbackData === 'object' && 'id' in fallbackData) {
      return { ...fallbackData, id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
    }

    return fallbackData;
  }
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
>>>>>>> d4575e9 (Feature Update)
  try {
    // Ensure base64 image has proper data URL format
    const formattedImage = base64Image.startsWith("data:image/")
      ? base64Image
      : `data:image/jpeg;base64,${base64Image}`;

    const data = await callBackendAPI<any>("analyze-image", {
      image: formattedImage,
      lang
    });

    return {
      ...MOCK_DISEASE_ANALYSIS,
      isPlant: data.isPlant !== undefined ? data.isPlant : true,
      diagnosis: data.diagnosis || "Healthy Crop",
      plantName: data.plantName || "Crop",
      description: data.description || "Analysis completed successfully.",
      confidence: data.confidence || 0.8,
      symptoms: data.symptoms || [],
      treatment: data.treatment || [],
      prevention: data.prevention || [],
      interventionPlan: data.interventionPlan || [],
      timestamp: Date.now(),
      id: Date.now().toString()
    };
  } catch (err) {
<<<<<<< HEAD
    console.error("Image Analysis Error:", err);
    return {
      id: "error-" + Date.now(),
      userId: "unknown",
      timestamp: Date.now(),
      isPlant: true, // Keep true to show the error card, or false to show "not a plant"
      plantName: "Unknown",
      diagnosis: "Analysis Failed",
      confidence: 0,
      description: "Unable to analyze the image. Please check your internet connection or try again later. (Server/API Error)",
      severity: "Low",
      interventionPlan: [],
      treatment: [],
      prevention: [],
      symptoms: []
    };
=======
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
    // Note: OpenRouter doesn't support image inputs directly, so we'll use text-only analysis
    // For images, we would need to use a different approach or model that supports images
    const messages = [
      {
        role: "user",
        content: prompt
      }
    ];

    return await makeModelRequest<DiseaseAnalysis>(
      messages,
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
>>>>>>> d4575e9 (Feature Update)
  }
};

/* =========================
   CHAT / LAND / YIELD / GOVT (Backend API)
========================= */

async function callBackendAPI<T>(endpoint: string, body?: any): Promise<T> {
  try {
    const res = await fetch(`/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Backend API Error: ${endpoint}`, err);
    throw err;
  }
}

/* =========================
   FRONTEND FUNCTIONS
========================= */

export const getFarmingAdvice = async (query: string): Promise<string> => {
<<<<<<< HEAD
  try {
    const data = await callBackendAPI<{ response: string }>("chat", { message: query });
    return data.response;
  } catch {
    return MOCK_FARMING_ADVICE;
  }
=======
  const messages = [
    {
      role: "user",
      content: `You are an expert millet farming consultant. Reply in the language of the user's query or default to English. ${query}`
    }
  ];

  return makeModelRequest<string>(
    messages,
    MOCK_FARMING_ADVICE
  );
>>>>>>> d4575e9 (Feature Update)
};

export const analyzeLand = async (
  soilType: string,
  ph: string,
  location: string,
  size: string,
  waterSource: string,
  lang: Language = "en"
): Promise<LandAnalysisResult> => {
<<<<<<< HEAD
  try {
    return await callBackendAPI<LandAnalysisResult>("land-analysis", {
      soilType,
      ph,
      location,
      size,
      waterSource,
      lang
    });
  } catch {
    return { ...MOCK_LAND_ANALYSIS, timestamp: Date.now() };
  }
};

export const calculateYieldPotential = async (
  crop: string,
  area: string,
  lang: Language = "en"
): Promise<YieldEstimate> => {
  try {
    return await callBackendAPI<YieldEstimate>("yield-estimate", {
      crop,
      area,
      lang
    });
  } catch {
    return MOCK_YIELD_ESTIMATE;
  }
};

export const findGovernmentSchemes = async (): Promise<GovtScheme[]> => {
  try {
    return await callBackendAPI<GovtScheme[]>("govt-schemes");
  } catch {
    return MOCK_GOVT_SCHEMES;
  }
=======
  const prompt = `Analyze land for Millets. Soil: ${soilType}, pH: ${ph}, Location: ${location}, Size: ${size}, Water Source: ${waterSource}. Response in ${getLangName(lang)}. Return JSON with: suitabilityScore (number 0-100), suitableCrops (array of strings), soilImprovements (array of strings), waterAnalysis (string), rotationRecommendation (array of strings), summary (string).`;

  const messages = [
    {
      role: "user",
      content: prompt
    }
  ];

  return makeModelRequest<LandAnalysisResult>(
    messages,
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

  const messages = [
    {
      role: "user",
      content: prompt
    }
  ];

  return makeModelRequest<YieldEstimate>(
    messages,
    MOCK_YIELD_ESTIMATE,
    (text) => {
      const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleaned);
    }
  );
};

export const findGovernmentSchemes = async (): Promise<GovtScheme[]> => {
  const prompt = "List 4 key Indian Govt schemes for Millet Farming. Return JSON array with each item having: name (string), benefits (string), eligibility (string).";

  const messages = [
    {
      role: "user",
      content: prompt
    }
  ];

  return makeModelRequest<GovtScheme[]>(
    messages,
    MOCK_GOVT_SCHEMES,
    (text) => {
      const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleaned);
    }
  );
>>>>>>> d4575e9 (Feature Update)
};
