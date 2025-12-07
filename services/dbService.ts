
import { DiseaseAnalysis, FarmCrop, LandAnalysisResult, UserProfile } from "../types";

/**
 * MOCK MONGODB SERVICE
 * This service mimics a MongoDB Database structure using LocalStorage.
 * In a production app, these functions would be async API calls to a real MongoDB backend.
 */

const DB_NAME = 'agritech_db';
const COLLECTIONS = {
  USERS: 'users',
  CROPS: 'crops',
  SCANS: 'scans',
  LAND_REPORTS: 'land_reports'
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get collection data
const getCollection = <T>(collectionName: string): T[] => {
  const dbStr = localStorage.getItem(DB_NAME);
  const db = dbStr ? JSON.parse(dbStr) : {};
  return db[collectionName] || [];
};

// Helper to save collection data
const saveCollection = <T>(collectionName: string, data: T[]) => {
  const dbStr = localStorage.getItem(DB_NAME);
  const db = dbStr ? JSON.parse(dbStr) : {};
  db[collectionName] = data;
  localStorage.setItem(DB_NAME, JSON.stringify(db));
};

export const db = {
  users: {
    async create(user: UserProfile): Promise<UserProfile> {
      await delay(500);
      const users = getCollection<UserProfile>(COLLECTIONS.USERS);
      // Check if phone exists
      if (users.find(u => u.phone === user.phone)) {
        throw new Error("User with this phone already exists");
      }
      users.push(user);
      saveCollection(COLLECTIONS.USERS, users);
      // Set current session
      localStorage.setItem('agritech_session_user', JSON.stringify(user));
      return user;
    },
    async findOne(phone: string): Promise<UserProfile | null> {
      await delay(500);
      const users = getCollection<UserProfile>(COLLECTIONS.USERS);
      return users.find(u => u.phone === phone) || null;
    },
    async update(user: UserProfile): Promise<UserProfile> {
      await delay(300);
      const users = getCollection<UserProfile>(COLLECTIONS.USERS);
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
        saveCollection(COLLECTIONS.USERS, users);
        localStorage.setItem('agritech_session_user', JSON.stringify(user));
        return user;
      }
      throw new Error("User not found");
    },
    getSession(): UserProfile | null {
      const u = localStorage.getItem('agritech_session_user');
      return u ? JSON.parse(u) : null;
    },
    logout() {
      localStorage.removeItem('agritech_session_user');
    }
  },

  crops: {
    async findAll(userId: string): Promise<FarmCrop[]> {
      const crops = getCollection<FarmCrop>(COLLECTIONS.CROPS);
      return crops.filter(c => c.userId === userId);
    },
    async create(crop: FarmCrop): Promise<FarmCrop> {
      const crops = getCollection<FarmCrop>(COLLECTIONS.CROPS);
      crops.push(crop);
      saveCollection(COLLECTIONS.CROPS, crops);
      return crop;
    },
    async delete(id: string) {
      let crops = getCollection<FarmCrop>(COLLECTIONS.CROPS);
      crops = crops.filter(c => c.id !== id);
      saveCollection(COLLECTIONS.CROPS, crops);
    }
  },

  scans: {
    async findAll(userId: string): Promise<DiseaseAnalysis[]> {
      const scans = getCollection<DiseaseAnalysis>(COLLECTIONS.SCANS);
      // Sort by timestamp desc
      return scans.filter(s => s.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
    },
    async create(scan: DiseaseAnalysis): Promise<DiseaseAnalysis> {
      const scans = getCollection<DiseaseAnalysis>(COLLECTIONS.SCANS);
      scans.push(scan);
      // Limit to last 50 per user (simulating logic)
      saveCollection(COLLECTIONS.SCANS, scans);
      return scan;
    }
  },

  landReports: {
    async findAll(userId: string): Promise<LandAnalysisResult[]> {
      const reports = getCollection<LandAnalysisResult>(COLLECTIONS.LAND_REPORTS);
      return reports.filter(r => r.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
    },
    async create(report: LandAnalysisResult): Promise<LandAnalysisResult> {
      const reports = getCollection<LandAnalysisResult>(COLLECTIONS.LAND_REPORTS);
      reports.push(report);
      saveCollection(COLLECTIONS.LAND_REPORTS, reports);
      return report;
    }
  },
  
  clearAll() {
    localStorage.removeItem(DB_NAME);
    localStorage.removeItem('agritech_session_user');
  }
};
