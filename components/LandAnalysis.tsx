
import React, { useState, useEffect } from 'react';
import { MapPin, FlaskConical, Ruler, Loader2, Check, AlertTriangle, History, Droplets, RotateCw } from 'lucide-react';
import { analyzeLand } from '../services/geminiService';
import { LandAnalysisResult } from '../types';
import { db } from '../services/dbService';
import { useLanguage } from '../contexts/LanguageContext';

const LandAnalysis: React.FC = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    soilType: 'Red Soil',
    ph: '6.5',
    location: '',
    size: '1 acre',
    waterSource: 'Rainfed'
  });
  const [result, setResult] = useState<LandAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<LandAnalysisResult[]>([]);

  useEffect(() => {
    loadHistory();
  }, [language]);

  const loadHistory = async () => {
    const user = db.users.getSession();
    if (user) {
      const reports = await db.landReports.findAll(user.id);
      setHistory(reports);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const analysis = await analyzeLand(
        formData.soilType, 
        formData.ph, 
        formData.location, 
        formData.size,
        formData.waterSource,
        language
      );
      
      const user = db.users.getSession();
      if (user) {
        const fullResult = { 
          ...analysis, 
          userId: user.id,
          soilType: formData.soilType,
          location: formData.location 
        };
        await db.landReports.create(fullResult);
        setResult(fullResult);
        loadHistory();
      }
    } catch (error) {
      alert("Failed to analyze land data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row g-4">
      {/* Form Section */}
      <div className="col-lg-4 d-flex flex-column gap-4">
        <div className="card p-4 shadow-sm border-0">
          <h2 className="h5 font-bold text-dark mb-4">{t('land.title')}</h2>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label small fw-bold text-secondary mb-1">{t('land.soil')}</label>
              <select name="soilType" value={formData.soilType} onChange={handleChange} className="form-select">
                  <option>Red Soil (Ideal for Ragi)</option>
                  <option>Black Soil (Cotton Soil)</option>
                  <option>Sandy Loam (Bajra)</option>
                  <option>Clay</option>
              </select>
            </div>
            <div>
              <label className="form-label small fw-bold text-secondary mb-1">{t('land.ph')}</label>
              <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} className="form-control" />
            </div>
            <div>
              <label className="form-label small fw-bold text-secondary mb-1">{t('land.water')}</label>
              <select name="waterSource" value={formData.waterSource} onChange={handleChange} className="form-select">
                  <option>Rainfed</option>
                  <option>Borewell</option>
                  <option>Canal</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn btn-success w-100 py-3 mt-2 shadow">
              {loading ? <Loader2 className="animate-spin" /> : t('land.analyze')}
            </button>
          </form>
        </div>

        {/* Previous Reports List */}
        <div className="card p-3 shadow-sm border-0">
           <h3 className="h6 fw-bold text-secondary mb-3 d-flex align-items-center gap-2">
             <History size={16} /> {t('land.history')}
           </h3>
           <div className="d-flex flex-column gap-2 overflow-y-auto" style={{ maxHeight: '200px' }}>
              {history.map(item => (
                <button key={item.id} onClick={() => setResult(item)} className="btn btn-light text-start p-2 border-0 w-100">
                   <div className="d-flex justify-content-between fw-bold text-dark small">
                      <span>{item.location || 'Unknown'}</span>
                      <span className="text-success">{item.suitabilityScore}/100</span>
                   </div>
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="col-lg-8">
        {result && (
          <div className="card border-0 shadow-sm p-4 animate-fade-in d-flex flex-column gap-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-4 gap-3">
               <div>
                  <h3 className="h4 fw-bold text-dark mb-1">{t('land.score')}</h3>
               </div>
               <div className="px-4 py-2 rounded-4 h5 fw-bold mb-0 shadow-sm bg-success-subtle text-success">
                 {result.suitabilityScore}/100
               </div>
            </div>

            <div className="bg-light p-3 rounded-3 border text-dark">
                {result.summary}
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <h4 className="h6 fw-bold text-dark mb-3">{t('land.crops')}</h4>
                <div className="d-flex flex-wrap gap-2">
                  {result.suitableCrops.map((crop, i) => (
                    <span key={i} className="badge bg-success-subtle text-success p-2">{crop}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandAnalysis;
