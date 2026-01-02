
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CropDoctor from './components/CropDoctor';
import CropGuide from './components/CropGuide';
import LandAnalysis from './components/LandAnalysis';
import Maps from './components/Maps';
import Community from './components/Community';
import Marketplace from './components/Marketplace';
import Auth from './components/Auth';
import Profile from './components/Profile';
import { View, NavigationContext, UserProfile } from './types';
import { db } from './services/dbService';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Main Content Wrapper to consume Language Context
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [viewData, setViewData] = useState<NavigationContext | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const loadedUser = db.users.getSession();
    if (loadedUser) {
      setUser(loadedUser);
      setLanguage(loadedUser.language);
    }
    setAuthLoading(false);
  }, []);

  const handleNavigate = (view: View, data?: any) => {
    setCurrentView(view);
    setViewData(data || null);
  };

  const handleLogout = () => {
    db.users.logout();
    setUser(null);
    setCurrentView(View.DASHBOARD);
  };

  if (authLoading) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light text-secondary">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard onNavigate={handleNavigate} />;
      case View.DOCTOR: return <CropDoctor onNavigate={handleNavigate} />;
      case View.GUIDE: return <CropGuide initialData={viewData} />;
      case View.LAND: return <LandAnalysis />;
      case View.MAPS: return <Maps />;
      case View.MARKET: return <Marketplace />;
      case View.COMMUNITY: return <Community />;
      case View.PROFILE: return <Profile user={user} onUpdate={setUser} onLogout={handleLogout} />;
      default: return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
      <main className="flex-grow-1 p-3 p-md-4">
        <div className="container-fluid p-0">
          {/* 
            Desktop: Add left margin for sidebar (260px)
            Mobile: No margin, but add bottom padding for nav (80px)
          */}
          <div className="main-layout">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
