
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DiseaseAnalysis, LandAnalysisResult, YieldEstimate, GovtScheme, Language } from "../types";

const getAiClient = () => {
  return new GoogleGenerativeAI(process.env.VITE_API_KEY || "");
};

// Helper to get language name
const getLangName = (l: Language) => {
  switch(l) {
    case 'hi': return 'Hindi';
    case 'kn': return 'Kannada';
    case 'te': return 'Telugu';
    default: return 'English';
  }
};

export const analyzeCropImage = async (base64Image: string, lang: Language = 'en'): Promise<DiseaseAnalysis> => {
  const ai = getAiClient();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  const prompt = `Analyze this millet crop image. Detect disease. Provide response in ${getLangName(lang)} language. Return JSON with: isPlant (boolean), plantName (string), diagnosis (string), confidence (number 0-1), description (string), severity ("Low", "Medium", "High"), interventionPlan (array of {day: string, action: string}), treatment (array of strings), prevention (array of strings).`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanedText) as DiseaseAnalysis;
    parsed.id = Date.now().toString();
    parsed.timestamp = Date.now();
    return parsed;
  } catch (error) {
    throw error;
  }
};

export const getFarmingAdvice = async (query: string): Promise<string> => {
  const ai = getAiClient();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const result = await model.generateContent(`You are an expert millet farming consultant. Reply in the language of the user's query or default to English. ${query}`);
    const response = await result.response;
    return response.text() || "Error";
  } catch (error) {
    return "Error";
  }
};

export const analyzeLand = async (
  soilType: string,
  ph: string,
  location: string,
  size: string,
  waterSource: string,
  lang: Language = 'en'
): Promise<LandAnalysisResult> => {
  const ai = getAiClient();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze land for Millets. Soil: ${soilType}, pH: ${ph}, Location: ${location}, Size: ${size}, Water Source: ${waterSource}. Response in ${getLangName(lang)}. Return JSON with: suitabilityScore (number 0-100), suitableCrops (array of strings), soilImprovements (array of strings), waterAnalysis (string), rotationRecommendation (array of strings), summary (string).`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanedText) as LandAnalysisResult;
    parsed.id = Date.now().toString();
    parsed.timestamp = Date.now();
    return parsed;
  } catch (error) {
    throw error;
  }
};

export const calculateYieldPotential = async (crop: string, area: string, lang: Language = 'en'): Promise<YieldEstimate> => {
  const ai = getAiClient();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Calculate yield/profit for ${crop} on ${area} acres in India. Response in ${getLangName(lang)}. Return JSON with: crop (string), estimatedYield (string), estimatedIncome (string), cultivationCost (string), profitMargin (string), tips (array of strings).`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText) as YieldEstimate;
  } catch (error) {
    throw error;
  }
};

export const findGovernmentSchemes = async (): Promise<GovtScheme[]> => {
  const ai = getAiClient();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "List 4 key Indian Govt schemes for Millet Farming. Return JSON array with each item having: name (string), benefits (string), eligibility (string).";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedText) as GovtScheme[];
  } catch (error) {
    return [];
  }
};
