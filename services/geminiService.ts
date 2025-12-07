
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
  "gemini-2.0-flash",               // Primary
  "gemini-2.0-flash-lite-preview-02-05", // Secondary
  "gemini-2.0-flash-exp",           // Experimental fallback
];

const getAiClient = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    console.error("VITE_API_KEY is missing/empty in .env");
    // Throwing here might crash the app on load if called early.
    // Instead return a client with a placeholder that will fail only on request.
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
      const isRateLimit = error.message?.includes('429') || error.status === 429;
      const isQuotaExceeded = error.message?.includes('403') || error.status === 403;
      const isOverloaded = error.message?.includes('503') || error.status === 503;
      const isNotFound = error.message?.includes('404') || error.status === 404;

      if (isRateLimit || isQuotaExceeded || isOverloaded || isNotFound) {
        console.warn(`Model ${modelName} failed (${error.status || 'Error'}). Trying next...`);
        continue; // Try next model immediately without waiting
      }

      // If it's a parsing error or other fatal error, stop trying other models if they'd likely fail too, 
      // but for now, let's assume it's model-specific and try getting a better result.
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

export const analyzeCropImage = async (base64Image: string, lang: Language = 'en'): Promise<DiseaseAnalysis> => {
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  const prompt = `Analyze this millet crop image. Detect disease. Provide response in ${getLangName(lang)} language. Return JSON with: isPlant (boolean), plantName (string), diagnosis (string), confidence (number 0-1), description (string), severity ("Low", "Medium", "High"), interventionPlan (array of {day: string, action: string}), treatment (array of strings), prevention (array of strings).`;

  return makeModelRequest<DiseaseAnalysis>(
    [
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64,
        },
      },
    ],
    { ...MOCK_DISEASE_ANALYSIS, timestamp: Date.now() }, // Fallback
    (text) => {
      const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      parsed.id = Date.now().toString();
      parsed.timestamp = Date.now();
      return parsed;
    }
  );
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
