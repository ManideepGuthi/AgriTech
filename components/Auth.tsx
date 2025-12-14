
import React, { useState } from 'react';
import { Sprout, Phone, Lock, User, MapPin, Ruler, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { db } from '../services/dbService';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const { t, language, setLanguage } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation State
  const [validated, setValidated] = useState(false);

  // Form States
  const [loginData, setLoginData] = useState({ phone: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    location: '',
    farmSize: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulation of login check (In real app, password check happens on backend)
      const user = await db.users.findOne(loginData.phone);
      if (user) {
        // In simulation, we assume password matches if user exists for this demo
        // as we aren't storing passwords securely in this mock
        db.users.create(user); // Refresh session
        onLogin(user);
      } else {
        // Auto-register if not found (for demo simplicity) or show error
        // For now, let's keep the error to be explicit
        setError("User not found. Please register first.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError(t('auth.error_pass_mismatch'));
      return;
    }

    if (registerData.phone.length !== 10) {
      setError(t('auth.error_phone'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if user already exists
      const existingUser = await db.users.findOne(registerData.phone);
      if (existingUser) {
        setError(t('auth.error_exists') || "User with this phone already exists");
        setIsLoading(false);
        return;
      }

      const newUser: UserProfile = {
        id: Date.now().toString(),
        name: registerData.name,
        phone: registerData.phone,
        location: registerData.location,
        farmSize: registerData.farmSize,
        language: language,
        joinedDate: Date.now()
      };

      await db.users.create(newUser);
      onLogin(newUser);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-3 bg-light">
      {/* Language Switcher */}
      <div className="position-absolute top-0 end-0 p-3 z-3 d-none d-md-block">
        <div className="btn-group shadow-sm">
          <button className={`btn btn-sm ${language === 'en' ? 'btn-success' : 'btn-light'}`} onClick={() => setLanguage('en')}>English</button>
          <button className={`btn btn-sm ${language === 'hi' ? 'btn-success' : 'btn-light'}`} onClick={() => setLanguage('hi')}>हिंदी</button>
          <button className={`btn btn-sm ${language === 'kn' ? 'btn-success' : 'btn-light'}`} onClick={() => setLanguage('kn')}>ಕನ್ನಡ</button>
          <button className={`btn btn-sm ${language === 'te' ? 'btn-success' : 'btn-light'}`} onClick={() => setLanguage('te')}>తెలుగు</button>
        </div>
      </div>

      {/* Mobile Language Switcher (Visible only on small screens) */}
      <div className="d-md-none w-100 mb-3 d-flex justify-content-center">
        <div className="btn-group shadow-sm">
          <button className={`btn btn-sm ${language === 'en' ? 'btn-success' : 'btn-light'}`} onClick={() => setLanguage('en')}>Eng</button>
          <button className={`btn btn-sm ${language === 'hi' ? 'btn-success' : 'btn-light'}`} onClick={() => setLanguage('hi')}>हिंदी</button>
          <button className={`btn btn-sm ${language === 'kn' ? 'btn-success' : 'btn-light'}`} onClick={() => setLanguage('kn')}>ಕನ್ನಡ</button>
          <button className={`btn btn-sm ${language === 'te' ? 'btn-success' : 'btn-light'}`} onClick={() => setLanguage('te')}>తెలుగు</button>
        </div>
      </div>

      <div className="card border-0 shadow-lg overflow-hidden w-100 animate-fade-in" style={{ maxWidth: '900px', borderRadius: '1.5rem' }}>
        <div className="row g-0">

          {/* Left Side - Brand / Info */}
          <div className="col-md-5 bg-dark text-white p-5 d-flex flex-column justify-content-between position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #15803d 0%, #1c1917 100%)' }}>

            <div className="position-relative z-1">
              <div className="d-flex align-items-center gap-3 mb-5">
                <div className="bg-white bg-opacity-25 p-2 rounded-3">
                  <Sprout size={32} className="text-white" />
                </div>
                <h1 className="h3 fw-bold m-0">{t('app.title')}</h1>
              </div>
              <h2 className="display-6 fw-bold mb-3">
                {isLogin ? t('auth.welcome') : t('auth.join')}
              </h2>
              <p className="text-white-50 lead fs-6">
                {isLogin ? t('auth.subtitle_in') : t('auth.subtitle_up')}
              </p>
            </div>

            <div className="position-relative z-1 mt-4">
              <p className="small text-white-50 m-0">{t('app.tagline')}</p>
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="col-md-7 p-4 p-md-5 d-flex flex-column justify-content-center bg-white">
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 small rounded-3 mb-4">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {isLogin ? (
              <div className="mx-auto w-100" style={{ maxWidth: '400px' }}>
                <h3 className="h4 fw-bold text-dark mb-2">{t('auth.login')}</h3>

                <form onSubmit={handleLogin} noValidate className={`d-flex flex-column gap-3 needs-validation ${validated ? 'was-validated' : ''}`}>
                  <div>
                    <label className="form-label small fw-bold text-secondary mb-1">{t('auth.phone')}</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text bg-light border-end-0"><Phone size={18} className="text-muted" /></span>
                      <input
                        type="tel"
                        value={loginData.phone}
                        onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                        className="form-control border-start-0 ps-1"
                        placeholder="e.g. 9876543210"
                        required
                        pattern="[0-9]{10}"
                      />
                      <div className="invalid-feedback">Valid 10-digit phone required.</div>
                    </div>
                  </div>
                  <div>
                    <label className="form-label small fw-bold text-secondary mb-1">{t('auth.password')}</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text bg-light border-end-0"><Lock size={18} className="text-muted" /></span>
                      <input
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="form-control border-start-0 ps-1"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                      <div className="invalid-feedback">Password must be at least 6 characters.</div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-dark w-100 py-3 rounded-3 shadow d-flex align-items-center justify-content-center gap-2 mt-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <>{t('auth.login')} <ArrowRight size={18} /></>}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-secondary small">
                    {t('auth.noAccount')} {' '}
                    <button
                      onClick={() => { setIsLogin(false); setValidated(false); setError(null); }}
                      className="btn btn-link p-0 fw-bold text-success text-decoration-none"
                    >
                      {t('auth.register')}
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto w-100" style={{ maxWidth: '400px' }}>
                <h3 className="h4 fw-bold text-dark mb-2">{t('auth.register')}</h3>

                <form onSubmit={handleSignup} noValidate className={`d-flex flex-column gap-3 needs-validation ${validated ? 'was-validated' : ''}`}>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-bold text-secondary mb-1">{t('auth.name')}</label>
                      <input
                        type="text"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        className="form-control"
                        required
                        minLength={2}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold text-secondary mb-1">{t('auth.phone')}</label>
                      <input
                        type="tel"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        className="form-control"
                        required
                        pattern="[0-9]{10}"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label small fw-bold text-secondary mb-1">{t('auth.location')}</label>
                    <input
                      type="text"
                      value={registerData.location}
                      onChange={(e) => setRegisterData({ ...registerData, location: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-bold text-secondary mb-1">{t('auth.farmSize')}</label>
                    <input
                      type="text"
                      value={registerData.farmSize}
                      onChange={(e) => setRegisterData({ ...registerData, farmSize: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-bold text-secondary mb-1">{t('auth.password')}</label>
                      <input
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="form-control"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold text-secondary mb-1">{t('auth.confirmPassword')}</label>
                      <input
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className="form-control"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-success w-100 py-3 rounded-3 mt-2 shadow d-flex align-items-center justify-content-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : t('auth.register')}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-secondary small">
                    {t('auth.hasAccount')} {' '}
                    <button
                      onClick={() => { setIsLogin(true); setValidated(false); setError(null); }}
                      className="btn btn-link p-0 fw-bold text-success text-decoration-none"
                    >
                      {t('auth.login')}
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
