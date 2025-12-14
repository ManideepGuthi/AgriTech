
import { DiseaseAnalysis, FarmCrop, LandAnalysisResult, UserProfile } from "../types";

const API_BASE = '/api';

export const db = {
  users: {
    async create(user: UserProfile): Promise<UserProfile> {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      const createdUser = await response.json();
      // Set current session
      localStorage.setItem('agritech_session_user', JSON.stringify(createdUser));
      return createdUser;
    },
    async findOne(phone: string): Promise<UserProfile | null> {
      const response = await fetch(`${API_BASE}/users?phone=${phone}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return await response.json();
    },
    async update(user: UserProfile): Promise<UserProfile> {
      const response = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      const updatedUser = await response.json();
      localStorage.setItem('agritech_session_user', JSON.stringify(updatedUser));
      return updatedUser;
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
      const response = await fetch(`${API_BASE}/crops?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch crops');
      return await response.json();
    },
    async create(crop: FarmCrop): Promise<FarmCrop> {
      const response = await fetch(`${API_BASE}/crops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crop)
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return await response.json();
    },
    async delete(id: string) {
      const response = await fetch(`${API_BASE}/crops/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
    }
  },

  scans: {
    async findAll(userId: string): Promise<DiseaseAnalysis[]> {
      const response = await fetch(`${API_BASE}/scans?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch scans');
      return await response.json();
    },
    async create(scan: DiseaseAnalysis): Promise<DiseaseAnalysis> {
      const response = await fetch(`${API_BASE}/scans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scan)
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return await response.json();
    }
  },

  landReports: {
    async findAll(userId: string): Promise<LandAnalysisResult[]> {
      const response = await fetch(`${API_BASE}/land-reports?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch land reports');
      return await response.json();
    },
    async create(report: LandAnalysisResult): Promise<LandAnalysisResult> {
      const response = await fetch(`${API_BASE}/land-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return await response.json();
    }
  },

  clearAll() {
    localStorage.removeItem('agritech_session_user');
  }
};
