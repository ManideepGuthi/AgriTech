
import React, { useState, useRef, useEffect } from 'react';
import { Camera, AlertCircle, CheckCircle, XCircle, Loader2, Calendar, Thermometer, MessageCircle, History } from 'lucide-react';
import { analyzeCropImage } from '../services/geminiService';
import { DiseaseAnalysis, View } from '../types';
import { db } from '../services/dbService';
import { useLanguage } from '../contexts/LanguageContext';

interface CropDoctorProps {
  onNavigate?: (view: View, data?: any) => void;
}

const CropDoctor: React.FC<CropDoctorProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<DiseaseAnalysis[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadHistory();
  }, [language]);

  const loadHistory = async () => {
    const user = db.users.getSession();
    if (user) {
      const scans = await db.scans.findAll(user.id);
      setHistory(scans);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(t('doctor.upload_error'));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeCropImage(selectedImage, language);
      setResult(analysis);

      const user = db.users.getSession();
      if (user) {
        await db.scans.create({ ...analysis, userId: user.id });
        loadHistory();
      }
    } catch (err) {
      setError("Analysis failed. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadFromHistory = (item: DiseaseAnalysis) => {
    setResult(item);
    setSelectedImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="row g-4">
      <div className="col-lg-8 d-flex flex-column gap-4">
        <div className="card p-4 shadow-sm border-0">
          <h2 className="h4 font-bold text-dark mb-2">{t('doctor.title')}</h2>
          <p className="text-secondary mb-4">{t('doctor.subtitle')}</p>

          {!selectedImage && !result ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-secondary-subtle rounded-4 p-5 d-flex flex-column align-items-center justify-content-center cursor-pointer bg-light hover-bg-stone-50"
              style={{ minHeight: '300px' }}
            >
              <div className="bg-success-subtle p-3 rounded-circle mb-3">
                <Camera size={40} className="text-success" />
              </div>
              <p className="fw-bold fs-5 text-secondary">{t('doctor.scan')}</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="d-none"
              />
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {selectedImage && (
                <div className="position-relative rounded-4 overflow-hidden bg-dark shadow-inner" style={{ height: '300px' }}>
                  <img
                    src={selectedImage}
                    alt="Crop preview"
                    className="w-100 h-100 object-fit-contain"
                  />
                  <button
                    onClick={reset}
                    className="position-absolute top-0 end-0 m-3 btn btn-dark rounded-circle p-2"
                    style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              )}

              {!result && (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="btn btn-success w-100 py-3 rounded-4 shadow-lg d-flex align-items-center justify-content-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" /> {t('doctor.analyzing')}
                    </>
                  ) : (
                    <>
                      <StethoscopeIcon /> Run Diagnosis
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-3 rounded-4" role="alert">
            <XCircle size={20} />
            <div className="fw-medium">{error}</div>
          </div>
        )}

        {result && !result.isPlant && (
          <div className="alert alert-warning d-flex align-items-center gap-3 rounded-4" role="alert">
            <AlertCircle size={20} />
            <div className="fw-medium">
              This image does not appear to be a crop or agricultural scene. 
              Please upload a valid crop image for analysis.
            </div>
          </div>
        )}

        {result && result.isPlant && (
          <div className="card border-0 shadow-sm overflow-hidden animate-fade-in position-relative">
            <div className="p-4 border-bottom bg-light">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-warning text-dark p-3 rounded-4">
                  <AlertCircle size={32} />
                </div>
                <div className="flex-grow-1">
                  <h3 className="h4 fw-bold text-dark mb-0">{result.diagnosis}</h3>
                  <p className="small text-muted mt-1">{result.plantName}</p>
                </div>
              </div>
            </div>

            <div className="p-4 d-flex flex-column gap-4">
              <div>
                <h4 className="small fw-bold text-secondary text-uppercase mb-2">Observation</h4>
                <p className="text-dark bg-white p-3 rounded-4 border">{result.description}</p>
              </div>

              <div>
                <h4 className="small fw-bold text-primary text-uppercase mb-3">
                  {t('doctor.treatment')}
                </h4>
                <div className="d-flex flex-column gap-2">
                  {result.interventionPlan && result.interventionPlan.map((step, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-3 p-3 bg-primary-subtle rounded-3">
                      <span className="badge bg-primary">{step.day}</span>
                      <p className="mb-0 small fw-medium">{step.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate && onNavigate(View.GUIDE, { initialQuery: `Diagnosed ${result.diagnosis} on ${result.plantName}. Help me.` })}
                className="btn btn-dark w-100 py-3 rounded-4 d-flex align-items-center justify-content-center gap-2"
              >
                <MessageCircle size={20} /> {t('doctor.ask_expert')}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="col-lg-4 d-flex flex-column gap-3">
        <h3 className="h6 fw-bold text-secondary d-flex align-items-center gap-2 m-0">
          <History size={20} /> {t('doctor.history')}
        </h3>
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="list-group list-group-flush">
            {history.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                onClick={() => loadFromHistory(item)}
                className="list-group-item list-group-item-action p-3"
              >
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <h6 className="fw-bold text-dark mb-0">{item.plantName}</h6>
                  <span className="small text-muted">{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="small text-secondary mb-0">{item.diagnosis}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StethoscopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 0 0 5 2h14a.3.3 0 0 0 .2.3v3.4a3 3 0 0 0 3 3v8.3a3 3 0 0 0-.2.3H2a.3.3 0 0 0-.2-.3V8.7a3 3 0 0 0 3-3V2.3z" /><path d="M8 2v18" /><path d="M16 2v18" /></svg>
);

export default CropDoctor;
