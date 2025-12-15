
export enum View {
  DASHBOARD = 'DASHBOARD',
  DOCTOR = 'DOCTOR',
  GUIDE = 'GUIDE',
  LAND = 'LAND',
  PROFILE = 'PROFILE',
}

export type Language = 'en' | 'hi' | 'kn' | 'te';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  location: string;
  farmSize: string;
  language: Language;
  joinedDate: number;
}

export interface DiseaseAnalysis {
  id: string;
  userId: string;
  timestamp: number;
  isPlant: boolean;
  plantName: string;
  diagnosis: string;
  confidence: number;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  interventionPlan: { day: string; action: string }[];
  treatment: string[];
  prevention: string[];
  symptoms: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface LandAnalysisResult {
  id: string;
  userId: string;
  timestamp: number;
  suitabilityScore: number;
  suitableCrops: string[];
  soilImprovements: string[];
  waterAnalysis: string;
  rotationRecommendation: string[];
  summary: string;
  soilType?: string;
  location?: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
}

export interface FarmCrop {
  id: string;
  userId: string;
  name: string;
  variety: string;
  area: number;
  sownDate: string;
  status: 'Healthy' | 'At Risk' | 'Ready to Harvest';
}

export interface MarketPrice {
  crop: string;
  price: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface YieldEstimate {
  crop: string;
  estimatedYield: string;
  estimatedIncome: string;
  cultivationCost: string;
  profitMargin: string;
  tips: string[];
}

export interface GovtScheme {
  name: string;
  benefits: string;
  eligibility: string;
}

export interface NavigationContext {
  initialQuery?: string;
}