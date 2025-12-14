
import React, { useEffect, useState } from 'react';
import { CloudSun, Droplets, Wind, Plus, Trash2, Sprout, TrendingUp, TrendingDown, Calculator, Megaphone, X, MapPin, RefreshCw, Calendar, Stethoscope } from 'lucide-react';
import { View, FarmCrop, MarketPrice, YieldEstimate } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { db } from '../services/dbService';
import { calculateYieldPotential } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import gsap from 'gsap';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const COLORS = ['#16a34a', '#ca8a04', '#65a30d', '#854d0e', '#d97706'];

const DEFAULT_MARKET_DATA: MarketPrice[] = [
  { crop: 'Bajra (Pearl Millet)', price: 2350, trend: 'up', change: 120 },
  { crop: 'Jowar (Sorghum)', price: 2900, trend: 'stable', change: 0 },
  { crop: 'Ragi (Finger Millet)', price: 3400, trend: 'up', change: 250 },
  { crop: 'Foxtail Millet', price: 4100, trend: 'down', change: -50 },
];

const STATE_MARKET_DB: Record<string, MarketPrice[]> = {
  'Karnataka': [
    { crop: 'Ragi (Finger Millet)', price: 3600, trend: 'up', change: 150 },
    { crop: 'Jowar (Sorghum)', price: 3100, trend: 'stable', change: 20 },
    { crop: 'Bajra', price: 2400, trend: 'down', change: -40 },
    { crop: 'Little Millet', price: 4500, trend: 'up', change: 300 }
  ],
  'Rajasthan': [
    { crop: 'Bajra (Pearl Millet)', price: 2550, trend: 'up', change: 200 },
    { crop: 'Jowar (Sorghum)', price: 2800, trend: 'down', change: -50 },
    { crop: 'Moong', price: 7200, trend: 'stable', change: 10 },
    { crop: 'Guar', price: 5600, trend: 'up', change: 100 }
  ],
  'Maharashtra': [
    { crop: 'Jowar (Sorghum)', price: 3200, trend: 'up', change: 180 },
    { crop: 'Bajra', price: 2450, trend: 'stable', change: 0 },
    { crop: 'Ragi', price: 3300, trend: 'up', change: 100 },
    { crop: 'Soybean', price: 4600, trend: 'down', change: -120 }
  ]
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [crops, setCrops] = useState<FarmCrop[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [newCrop, setNewCrop] = useState({ name: 'Pearl Millet (Bajra)', variety: '', area: '', status: 'Healthy' });
  const [tasks, setTasks] = useState<{title: string, desc: string, priority: 'high'|'normal'}[]>([]);
  
  const [location, setLocation] = useState<{city: string, state: string, lat: number, lon: number} | null>(null);
  const [weather, setWeather] = useState<{temp: number, humidity: number, wind: number, condition: string} | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>(DEFAULT_MARKET_DATA);

  const [calcData, setCalcData] = useState({ crop: 'Pearl Millet (Bajra)', area: '1' });
  const [calcResult, setCalcResult] = useState<YieldEstimate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    loadData();
    initializeLocation();
    
    gsap.fromTo(".gsap-fade-up", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, [language]);

  const loadData = async () => {
    const user = db.users.getSession();
    if (user) {
      const loadedCrops = await db.crops.findAll(user.id);
      setCrops(loadedCrops);
      generateSmartTasks(loadedCrops);
    }
  };

  const initializeLocation = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!geoRes.ok) throw new Error('Geocoding failed');
          const geoData = await geoRes.json();
          
          const city = geoData.address.city || geoData.address.town || geoData.address.village || 'Unknown Loc';
          const state = geoData.address.state || 'India';
          
          setLocation({ city, state, lat: latitude, lon: longitude });

          if (STATE_MARKET_DB[state]) {
            setMarketPrices(STATE_MARKET_DB[state]);
          }

          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
          if (!weatherRes.ok) throw new Error('Weather API failed');
          const weatherData = await weatherRes.json();
          setWeather({
            temp: weatherData.current.temperature_2m,
            humidity: weatherData.current.relative_humidity_2m,
            wind: weatherData.current.wind_speed_10m,
            condition: 'Clear'
          });

        } catch (e) {
            console.error("Location/Weather fetch error:", e);
        }
      },
      (error) => {
        console.warn("Geolocation permission denied or error:", error.message);
        // Fallback to default location (e.g., Delhi)
        setLocation({ city: 'Delhi', state: 'Delhi', lat: 28.61, lon: 77.20 });
      }
    );
  };

  const generateSmartTasks = (currentCrops: FarmCrop[]) => {
    const newTasks = [];
    currentCrops.forEach(c => {
      if (c.status === 'At Risk') {
        newTasks.push({ 
          title: `Inspect ${c.name}`, 
          desc: 'Marked as "At Risk". Check for pests immediately.', 
          priority: 'high' 
        });
      }
    });
    
    if (newTasks.length === 0) {
      newTasks.push({ title: 'Field Scout', desc: 'Routine check of all crop zones suggested.', priority: 'normal' });
    }
    setTasks(newTasks as any);
  };

  const handleDelete = async (id: string) => {
    await db.crops.delete(id);
    loadData();
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop.variety || !newCrop.area) return;

    const user = db.users.getSession();
    if (user) {
      await db.crops.create({
        id: Date.now().toString(),
        userId: user.id,
        name: newCrop.name,
        variety: newCrop.variety,
        area: parseFloat(newCrop.area),
        sownDate: new Date().toISOString().split('T')[0],
        status: newCrop.status as any
      });
      setShowAddModal(false);
      setNewCrop({ name: 'Pearl Millet (Bajra)', variety: '', area: '', status: 'Healthy' });
      loadData();
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const result = await calculateYieldPotential(calcData.crop, calcData.area, language);
      setCalcResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCalculating(false);
    }
  };

  const chartData = crops.map(c => ({ name: c.name, value: c.area }));

  return (
    <div className="d-flex flex-column gap-4">
      <header className="card p-4 border-0 shadow-sm gsap-fade-up">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <h2 className="h4 fw-bold text-dark mb-1">{t('dashboard.overview')}</h2>
            <div className="d-flex align-items-center gap-2 text-secondary small">
               <Calendar size={14} />
               <span>{new Date().toLocaleDateString(language === 'en' ? 'en-IN' : language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
               {location && (
                 <>
                  <span className="mx-1">•</span>
                  <span className="badge bg-success-subtle text-success border border-success-subtle d-flex align-items-center gap-1">
                    <MapPin size={10} /> {location.city}, {location.state}
                  </span>
                 </>
               )}
            </div>
          </div>
          <div className="d-flex gap-2">
            <button 
              onClick={() => setShowCalculator(true)} 
              className="btn btn-light rounded-circle p-3 d-flex align-items-center justify-content-center"
              title={t('dashboard.profitCalc')}
            >
              <Calculator size={24} className="text-secondary" />
            </button>
            <button onClick={() => setShowAddModal(true)} className="btn btn-success rounded-circle p-3 shadow-sm d-flex align-items-center justify-content-center">
              <Plus size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Market Ticker */}
      <div className="gsap-fade-up">
        <h3 className="h6 fw-bold text-dark mb-2 px-1">{t('dashboard.market')}</h3>
        <div className="d-flex gap-3 overflow-x-auto pb-2 px-1">
          {marketPrices.map((item, idx) => (
            <div key={idx} className="card p-3 border-0 shadow-sm flex-shrink-0" style={{ minWidth: '160px' }}>
              <span className="text-secondary text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>{item.crop}</span>
              <div className="d-flex align-items-center gap-2 mt-2">
                <span className="h5 mb-0 fw-bold text-dark">₹{item.price}</span>
                {item.trend === 'up' && <TrendingUp size={16} className="text-success" />}
                {item.trend === 'down' && <TrendingDown size={16} className="text-danger" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {/* Main Stats Column */}
        <div className="col-lg-8 d-flex flex-column gap-4">
          
          {/* Weather Widget */}
          <div className="card border-0 text-white gsap-fade-up" style={{ background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)' }}>
            <div className="card-body p-4 position-relative overflow-hidden">
              
              <div className="d-flex justify-content-between align-items-start position-relative z-1">
                <div>
                  <p className="text-white-50 mb-1 fw-medium">{t('dashboard.weather')}</p>
                  <div className="d-flex align-items-baseline gap-1">
                    {weather ? (
                      <h3 className="display-4 fw-bold mb-0">{Math.round(weather.temp)}°</h3>
                    ) : (
                      <h3 className="display-4 fw-bold mb-0"><RefreshCw className="animate-spin" size={32} /></h3>
                    )}
                    <span className="h4 fw-medium text-white-50">C</span>
                  </div>
                  {/* Smart Advisory */}
                  <div className="mt-4 bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-25 d-flex align-items-start gap-3">
                    <Megaphone size={20} className="flex-shrink-0 text-warning" />
                    <div>
                      <p className="small fw-bold text-warning text-uppercase mb-0">{t('dashboard.advisory')}</p>
                      <p className="small fw-medium mb-0 lh-sm">
                        {weather && weather.humidity > 65 
                          ? "Humidity is high. Avoid evening irrigation." 
                          : "Weather is clear. Good time for fertilizer."}
                      </p>
                    </div>
                  </div>
                </div>
                <CloudSun size={64} className="text-warning opacity-75" />
              </div>
              
              <div className="mt-4 d-flex gap-3 small fw-medium">
                <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 px-3 py-2 rounded-3">
                  <Droplets size={16} className="text-info" />
                  <span>{weather ? `${weather.humidity}%` : '--%'}</span>
                </div>
                <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 px-3 py-2 rounded-3">
                  <Wind size={16} className="text-white-50" />
                  <span>{weather ? `${weather.wind} km/h` : '--'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Tasks */}
          <div className="card border-0 shadow-sm gsap-fade-up">
            <div className="card-body p-4">
              <h3 className="h6 fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                <Calendar size={20} className="text-success" /> {t('dashboard.tasks')}
              </h3>
              <div className="d-flex flex-column gap-3">
                {tasks.map((task, idx) => (
                  <div key={idx} className={`p-3 rounded-3 border-start border-4 d-flex justify-content-between align-items-center ${task.priority === 'high' ? 'border-danger bg-danger-subtle' : 'border-primary bg-primary-subtle'}`}>
                    <div>
                      <h4 className={`h6 fw-bold mb-1 ${task.priority === 'high' ? 'text-danger' : 'text-primary'}`}>{task.title}</h4>
                      <p className={`small mb-0 ${task.priority === 'high' ? 'text-danger' : 'text-primary'} opacity-75`}>{task.desc}</p>
                    </div>
                    <button className="btn btn-sm btn-light fw-bold text-secondary shadow-sm">Done</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Crop List */}
          <div className="gsap-fade-up">
             <div className="d-flex justify-content-between align-items-center mb-3">
               <h3 className="h5 fw-bold text-dark mb-0">{t('dashboard.myCrops')}</h3>
             </div>
             
             <div className="d-flex flex-column gap-3">
               {crops.length === 0 ? (
                 <div className="p-5 text-center bg-white border border-dashed rounded-4 text-muted">
                   {t('dashboard.noCrops')}
                 </div>
               ) : (
                 crops.map((crop) => (
                   <div key={crop.id} className="card border-0 shadow-sm p-3">
                     <div className="d-flex justify-content-between align-items-center">
                       <div className="d-flex align-items-center gap-3">
                         <div className="bg-warning-subtle text-warning p-3 rounded-3 d-flex align-items-center justify-content-center">
                           <Sprout size={24} />
                         </div>
                         <div>
                           <h4 className="h6 fw-bold text-dark mb-0">{crop.name}</h4>
                           <p className="small text-muted fw-medium mb-0">{crop.variety} • {crop.area} Acres</p>
                         </div>
                       </div>
                       <div className="d-flex align-items-center gap-2">
                         <span className={`badge rounded-pill ${
                           crop.status === 'Healthy' ? 'bg-success-subtle text-success' :
                           crop.status === 'At Risk' ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'
                         }`}>
                           {crop.status}
                         </span>
                         <button 
                           onClick={() => handleDelete(crop.id)}
                           className="btn btn-sm btn-outline-light text-secondary border-0"
                         >
                           <Trash2 size={18} />
                         </button>
                       </div>
                     </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="col-lg-4 d-flex flex-column gap-4 gsap-fade-up">
          {/* Quick Actions */}
          <div className="row g-3">
             <div className="col-6">
                <button 
                  onClick={() => onNavigate(View.DOCTOR)}
                  className="btn btn-light w-100 h-100 p-4 rounded-4 shadow-sm d-flex flex-column align-items-center justify-content-center gap-2 border bg-white"
                >
                  <Stethoscope size={24} className="text-danger" />
                  <span className="fw-bold text-secondary small">{t('nav.doctor')}</span>
                </button>
             </div>
             <div className="col-6">
                <button 
                    onClick={() => onNavigate(View.LAND)}
                    className="btn btn-light w-100 h-100 p-4 rounded-4 shadow-sm d-flex flex-column align-items-center justify-content-center gap-2 border bg-white"
                >
                  <MapPin size={24} className="text-primary" />
                  <span className="fw-bold text-secondary small">{t('nav.land')}</span>
                </button>
             </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4 d-flex flex-column h-100">
                <h3 className="h6 fw-bold text-dark mb-4">Land Usage</h3>
                <div className="flex-grow-1" style={{ minHeight: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-body p-4">
                <h3 className="h5 fw-bold mb-4 text-dark">{t('dashboard.addCrop')}</h3>
                <form onSubmit={handleAddSubmit} className="d-flex flex-column gap-3">
                  <div>
                    <label className="form-label small fw-bold text-secondary mb-1">Crop Type</label>
                    <select 
                      className="form-select"
                      value={newCrop.name}
                      onChange={e => setNewCrop({...newCrop, name: e.target.value})}
                    >
                      <option>Pearl Millet (Bajra)</option>
                      <option>Finger Millet (Ragi)</option>
                      <option>Sorghum (Jowar)</option>
                      <option>Foxtail Millet</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label small fw-bold text-secondary mb-1">Variety Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={newCrop.variety}
                      onChange={e => setNewCrop({...newCrop, variety: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label small fw-bold text-secondary mb-1">Area (Acres)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="form-control"
                      value={newCrop.area}
                      onChange={e => setNewCrop({...newCrop, area: e.target.value})}
                      required
                    />
                  </div>
                  <div className="d-flex gap-3 pt-3">
                    <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-light flex-grow-1">Cancel</button>
                    <button type="submit" className="btn btn-success flex-grow-1">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                 <h5 className="m-0 fw-bold">{t('dashboard.profitCalc')}</h5>
                 <button onClick={() => setShowCalculator(false)} className="btn-close"></button>
              </div>
              <div className="p-4">
                 {!calcResult ? (
                   <div className="d-flex flex-column gap-3">
                     <div>
                       <label className="form-label small fw-bold text-secondary mb-1">Crop</label>
                       <select className="form-select" value={calcData.crop} onChange={e => setCalcData({...calcData, crop: e.target.value})}>
                          <option>Pearl Millet (Bajra)</option>
                          <option>Finger Millet (Ragi)</option>
                          <option>Sorghum (Jowar)</option>
                       </select>
                     </div>
                     <div>
                       <label className="form-label small fw-bold text-secondary mb-1">Acres</label>
                       <input type="number" className="form-control" value={calcData.area} onChange={e => setCalcData({...calcData, area: e.target.value})} />
                     </div>
                     <button onClick={handleCalculate} disabled={isCalculating} className="btn btn-success w-100">{isCalculating ? 'Calculating...' : 'Calculate'}</button>
                   </div>
                 ) : (
                   <div className="d-flex flex-column gap-3">
                      <div className="alert alert-success m-0">
                         <h6 className="fw-bold">{t('dashboard.income')}: {calcResult.estimatedIncome}</h6>
                         <p className="mb-0 small">{t('dashboard.yield')}: {calcResult.estimatedYield}</p>
                      </div>
                      <button onClick={() => setCalcResult(null)} className="btn btn-light w-100">Back</button>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
