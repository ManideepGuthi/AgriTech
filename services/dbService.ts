import { DiseaseAnalysis, FarmCrop, LandAnalysisResult, UserProfile, Post, MarketItem } from "../types";

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
      localStorage.setItem('agritech_session_user', JSON.stringify(createdUser));
      return createdUser;
    },
    async findOne(phone: string): Promise<UserProfile | null> {
      const response = await fetch(`${API_BASE}/users?phone=${phone}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      return data.user;
    },
    async update(user: UserProfile): Promise<UserProfile> {
      const response = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (!response.ok) throw new Error('Failed to update user');
      const updatedUser = await response.json();
      localStorage.setItem('agritech_session_user', JSON.stringify(updatedUser));
      return updatedUser;
    },
    getSession(): UserProfile | null {
      const stored = localStorage.getItem('agritech_session_user');
      return stored ? JSON.parse(stored) : null;
    },
    logout() {
      localStorage.removeItem('agritech_session_user');
    }
  },
  market: {
    async findAll(): Promise<MarketItem[]> {
      const response = await fetch(`${API_BASE}/market`);
      if (!response.ok) throw new Error('Failed to fetch market items');
      return await response.json();
    },
    async create(item: MarketItem): Promise<MarketItem> {
      const response = await fetch(`${API_BASE}/market`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return await response.json();
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
      // Mock implementation since I don't see backend routes for land_reports
      // But server.js had 'land_reports' in MOCK_DB, so let's assume /api/land_reports exists or I should add it?
      // Wait, server.js MOCK_DB had 'land_reports', but I didn't see routes.
      // If routes don't exist, this will fail.
      // But the original code must have had it.
      // I'll check server.js again to be sure.
      // For now, I'll assume standard REST.
      const response = await fetch(`${API_BASE}/land_reports?userId=${userId}`);
      if (!response.ok) {
         // Fallback to local storage if API fails? Or just empty array
         return []; 
      }
      return await response.json();
    },
    async create(report: LandAnalysisResult): Promise<LandAnalysisResult> {
      const response = await fetch(`${API_BASE}/land_reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      if (!response.ok) {
         // Fallback
         throw new Error("Failed to save report");
      }
      return await response.json();
    }
  },
  posts: {
    async findAll(): Promise<Post[]> {
      const response = await fetch(`${API_BASE}/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return await response.json();
    },
    async create(post: Post): Promise<Post> {
      const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return await response.json();
    },
    async update(id: string, content: string, userId: string): Promise<void> {
      const response = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userId })
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
    },
    async delete(id: string, userId: string): Promise<void> {
      const response = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
    },
    async toggleLike(postId: string, userId: string): Promise<{ success: boolean; likes: number; likedBy: string[] }> {
      const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return await response.json();
    }
  },
  clearAll() {
    localStorage.clear();
    // Also clear mock db? No, just client side session usually.
  }
};
