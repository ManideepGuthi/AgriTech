
import React from 'react';
import { LayoutDashboard, Stethoscope, Sprout, Map, User } from 'lucide-react';
import { View } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const { t } = useLanguage();

  const navItems = [
    { view: View.DASHBOARD, label: t('nav.dashboard'), icon: LayoutDashboard },
    { view: View.DOCTOR, label: t('nav.doctor'), icon: Stethoscope },
    { view: View.GUIDE, label: t('nav.guide'), icon: Sprout },
    { view: View.LAND, label: t('nav.land'), icon: Map },
    { view: View.PROFILE, label: t('nav.profile'), icon: User },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="navbar fixed-bottom bg-white border-top d-md-none z-3 pb-3 pt-2">
        <div className="container-fluid d-flex justify-content-around">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`mobile-nav-item ${currentView === item.view ? 'active' : ''}`}
            >
              <item.icon size={22} strokeWidth={currentView === item.view ? 2.5 : 2} />
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <div className="d-none d-md-flex flex-column bg-white border-end position-fixed top-0 bottom-0 start-0 z-2" style={{ width: '260px' }}>
        <div className="p-4 border-bottom">
          <h1 className="h4 fw-bold text-success d-flex align-items-center gap-2 m-0">
            <Sprout className="text-success" />
            {t('app.title')}
          </h1>
        </div>
        <nav className="flex-grow-1 p-3 d-flex flex-column gap-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`nav-link-custom ${currentView === item.view ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-top">
          <p className="small text-muted m-0">v1.0 • {t('app.subtitle')}</p>
        </div>
      </div>
    </>
  );
};

export default Navigation;
