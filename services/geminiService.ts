import {
  DiseaseAnalysis,
  LandAnalysisResult,
  YieldEstimate,
  GovtScheme,
  Language
} from "../types";

import {
  MOCK_DISEASE_ANALYSIS,
  MOCK_FARMING_ADVICE,
  MOCK_LAND_ANALYSIS,
  MOCK_YIELD_ESTIMATE,
  MOCK_GOVT_SCHEMES
} from "./mockData";

/* =========================
   HELPERS
========================= */

const getLangName = (l: Language) => {
  switch (l) {
    case "hi": return "Hindi";
    case "kn": return "Kannada";
    case "te": return "Telugu";
    default: return "English";
  }
};

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
  try {
    const data = await callBackendAPI<{ response: string }>("chat", { message: query });
    return data.response;
  } catch {
    return MOCK_FARMING_ADVICE;
  }
};

export const analyzeLand = async (
  soilType: string,
  ph: string,
  location: string,
  size: string,
  waterSource: string,
  lang: Language = "en"
): Promise<LandAnalysisResult> => {
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
};
