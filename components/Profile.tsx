
import React, { useState } from 'react';
import { User, Phone, MapPin, Ruler, Globe, Settings, LogOut, Trash2, Edit2, Save, X } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { db } from '../services/dbService';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate, onLogout }) => {
  const { t, setLanguage } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  const handleSave = async () => {
    await db.users.update(editForm);
    setLanguage(editForm.language);
    onUpdate(editForm);
    setIsEditing(false);
  };

  const handleClearData = () => {
    if (confirm("Are you sure? This will delete all your local data.")) {
      db.clearAll();
      window.location.reload();
    }
  };

  return (
    <div className="container-fluid p-0 animate-fade-in">
      {/* Header */}
      <div className="card border-0 bg-dark text-white mb-4 shadow overflow-hidden" style={{ background: 'linear-gradient(to right, #292524, #1c1917)' }}>
        <div className="card-body p-4 p-md-5 d-flex flex-column flex-md-row align-items-center gap-4 position-relative z-1">
          <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow border border-4 border-white border-opacity-10" style={{ width: '100px', height: '100px', fontSize: '2.5rem', background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)' }}>
             {user.name.charAt(0)}
          </div>
          <div className="text-center text-md-start flex-grow-1">
             <h2 className="h2 fw-bold mb-1">{user.name}</h2>
             <p className="text-white-50 d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-0">
               <MapPin size={16} /> {user.location}
             </p>
          </div>
          <button 
             onClick={() => setIsEditing(!isEditing)}
             className="btn btn-outline-light d-flex align-items-center gap-2"
          >
             {isEditing ? <><X size={20} /> Cancel</> : <><Edit2 size={20} /> {t('profile.edit')}</>}
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* User Details Form */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 h-100">
             <div className="d-flex justify-content-between align-items-center mb-4">
               <h3 className="h5 fw-bold text-dark mb-0">{t('profile.info')}</h3>
               {isEditing && (
                 <button 
                   onClick={handleSave}
                   className="btn btn-success btn-sm d-flex align-items-center gap-2 fw-bold"
                 >
                   <Save size={16} /> {t('profile.save')}
                 </button>
               )}
             </div>

             <div className="d-flex flex-column gap-4">
               <div className="row g-3">
                 <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary text-uppercase mb-1">{t('auth.name')}</label>
                    <input type="text" disabled={!isEditing} value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="form-control" />
                 </div>
                 <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary text-uppercase mb-1">{t('auth.phone')}</label>
                    <input type="text" disabled={!isEditing} value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="form-control" />
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Settings Column */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 h-100">
             <h3 className="h5 fw-bold text-dark mb-4 d-flex align-items-center gap-2">
               <Settings className="text-secondary" /> {t('profile.settings')}
             </h3>
             
             <div className="d-flex flex-column gap-3">
               <div>
                  <label className="form-label small fw-bold text-secondary text-uppercase mb-2">{t('profile.language')}</label>
                  <select 
                    disabled={!isEditing}
                    value={editForm.language}
                    onChange={(e) => setEditForm({...editForm, language: e.target.value as Language})}
                    className="form-select"
                  >
                     <option value="en">English</option>
                     <option value="hi">Hindi (हिंदी)</option>
                     <option value="kn">Kannada (ಕನ್ನಡ)</option>
                     <option value="te">Telugu (తెలుగు)</option>
                  </select>
               </div>

               <hr className="my-3 text-secondary" />

               <button onClick={handleClearData} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-start gap-3 p-3 border-0 bg-danger-subtle text-danger">
                 <Trash2 size={18} /> <span className="fw-medium">{t('profile.clearData')}</span>
               </button>

               <button onClick={onLogout} className="btn btn-light w-100 d-flex align-items-center justify-content-start gap-3 p-3 text-dark fw-bold">
                 <LogOut size={18} /> {t('profile.logout')}
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
