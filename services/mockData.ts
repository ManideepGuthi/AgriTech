// Mock Data for fallback when API is rate limited
// This ensures the application remains usable for demo/dev purposes.

import { DiseaseAnalysis, LandAnalysisResult, YieldEstimate, GovtScheme } from "../types";

export const MOCK_DISEASE_ANALYSIS: DiseaseAnalysis = {
    id: "mock-disease-1",
    userId: "mock-user", // Added to satisfy type
    timestamp: Date.now(),
    isPlant: true,
    plantName: "Pearl Millet (Bajra)",
    diagnosis: "Downy Mildew (Green Ear Disease)",
    confidence: 0.95,
    description: "Fungal infection causing chlorosis and 'green ear' structures. Common in humid conditions.",
    severity: "High",
    interventionPlan: [
        { day: "Day 1", action: "Remove and burn infected plants immediately." },
        { day: "Day 3", action: "Spray Mancozeb 75 WP @ 2.5g/liter water." }
    ],
    treatment: ["Mancozeb spray", "Crop rotation"],
    prevention: ["Use resistant varieties", "Seed treatment with Apron 35 SD"]
};

export const MOCK_FARMING_ADVICE =
    "Based on your location, Pearl Millet (Bajra) is suitable. Ensure soil moisture is adequate. " +
    "For pests, use Neem oil spray as a preventive measure. Current market price is stable.";

export const MOCK_LAND_ANALYSIS: LandAnalysisResult = {
    id: "mock-land-1",
    userId: "user-1",
    timestamp: Date.now(),
    location: "Hassan, Karnataka",
    soilType: "Red Soil",
    suitabilityScore: 85,
    suitableCrops: ["Finger Millet (Ragi)", "Groundnut", "Pigeon Pea"],
    soilImprovements: ["Add organic manure", "Correct pH if acidic"],
    waterAnalysis: "Rainfed condition suitable for millets",
    rotationRecommendation: ["Rotate with pulses", "Follow with Groundnut"],
    summary: "Land is highly suitable for Ragi cultivation with expected yield of 12-15 quintals/acre."
};

export const MOCK_YIELD_ESTIMATE: YieldEstimate = {
    crop: "Finger Millet (Ragi)",
    estimatedYield: "12-15 Quintals/Acre",
    estimatedIncome: "₹42,000 - ₹52,000",
    cultivationCost: "₹15,000",
    profitMargin: "65%",
    tips: ["Use high yielding varieties like GPU-28", "Go for transplanting method"]
};

export const MOCK_GOVT_SCHEMES: GovtScheme[] = [
    {
        name: "NFSM - Coarse Cereals",
        benefits: "Subsidy on seeds (50%) and machinery.",
        eligibility: "All farmers growing millets."
    },
    {
        name: "PM Fasal Bima Yojana",
        benefits: "Crop insurance against natural calamities.",
        eligibility: "Farmers with crops notified by State Govt."
    },
    {
        name: "Paramparagat Krishi Vikas Yojana",
        benefits: "₹50,000/ha for organic conversion.",
        eligibility: "Group of farmers with 50 acres land."
    },
    {
        name: "Millet Mission (State Specific)",
        benefits: "Processing unit subsidy up to 50%.",
        eligibility: "FPOs and SHGs involved in millet processing."
    }
];
