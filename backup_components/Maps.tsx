import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon, Store, FlaskConical, CloudSun, Snowflake, Navigation, Loader2 } from 'lucide-react';
import L from 'leaflet';
import { useLanguage } from '../contexts/LanguageContext';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons for different resource types
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

interface Location {
  lat: number;
  lng: number;
  name?: string;
  type?: 'user' | 'market' | 'soil' | 'weather' | 'storage';
}

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

const Maps: React.FC = () => {
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [resources, setResources] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLoc = { lat: latitude, lng: longitude, type: 'user' as const, name: 'My Farm' };
          setUserLocation(userLoc);
          generateNearbyResources(latitude, longitude);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setError("Unable to retrieve your location. Please enable location services.");
          // Default to a central location (e.g., Bangalore, India) if blocked
          const defaultLoc = { lat: 12.9716, lng: 77.5946, type: 'user' as const, name: 'Default Location' };
          setUserLocation(defaultLoc);
          generateNearbyResources(12.9716, 77.5946);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  const generateNearbyResources = (lat: number, lng: number) => {
    // Simulate resources around the user
    const types = [
        { type: 'market', name: 'APMC Market Yard', count: 2 },
        { type: 'soil', name: 'District Soil Testing Lab', count: 1 },
        { type: 'weather', name: 'Agri-Met Station', count: 1 },
        { type: 'storage', name: 'Cold Storage Facility', count: 2 }
    ];

    const newResources: Location[] = [];

    types.forEach(t => {
        for(let i=0; i < t.count; i++) {
            // Random offset within ~5-10km
            const latOffset = (Math.random() - 0.5) * 0.1; 
            const lngOffset = (Math.random() - 0.5) * 0.1;
            newResources.push({
                lat: lat + latOffset,
                lng: lng + lngOffset,
                type: t.type as any,
                name: `${t.name} ${i+1}`
            });
        }
    });

    setResources(newResources);
  };

  const getIconForType = (type: string) => {
      switch(type) {
          case 'user': return DefaultIcon;
          case 'market': return createCustomIcon('#0d6efd'); // Primary Blue
          case 'soil': return createCustomIcon('#198754'); // Success Green
          case 'weather': return createCustomIcon('#ffc107'); // Warning Yellow
          case 'storage': return createCustomIcon('#0dcaf0'); // Info Cyan
          default: return DefaultIcon;
      }
  };

  const features = [
    { icon: Store, label: t('maps.markets'), color: 'text-primary', bg: 'bg-primary-subtle' },
    { icon: FlaskConical, label: t('maps.soil_centers'), color: 'text-success', bg: 'bg-success-subtle' },
    { icon: CloudSun, label: t('maps.weather_stations'), color: 'text-warning', bg: 'bg-warning-subtle' },
    { icon: Snowflake, label: t('maps.storage'), color: 'text-info', bg: 'bg-info-subtle' },
  ];

  return (
    <div className="d-flex flex-column gap-4 animate-fade-in">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="h4 fw-bold text-dark m-0">{t('maps.title')}</h2>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm overflow-hidden" style={{ height: '500px' }}>
            <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
              <h3 className="h6 fw-bold text-secondary m-0 d-flex align-items-center gap-2">
                <MapIcon size={18} /> {t('maps.view')}
              </h3>
              {userLocation && (
                  <span className="badge bg-light text-secondary border">
                      <Navigation size={12} className="me-1"/>
                      {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </span>
              )}
            </div>
            
            <div className="card-body p-0 position-relative">
                {loading ? (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                        <div className="text-center text-muted">
                            <Loader2 size={32} className="animate-spin mb-2" />
                            <p>Locating your farm...</p>
                        </div>
                    </div>
                ) : userLocation ? (
                    <MapContainer 
                        center={[userLocation.lat, userLocation.lng]} 
                        zoom={13} 
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />
                        
                        {/* User Marker */}
                        <Marker position={[userLocation.lat, userLocation.lng]} icon={DefaultIcon}>
                            <Popup>
                                <b>Your Farm Location</b><br />
                                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                            </Popup>
                        </Marker>

                        {/* Resource Markers */}
                        {resources.map((res, idx) => (
                            <Marker key={idx} position={[res.lat, res.lng]} icon={getIconForType(res.type || '')}>
                                <Popup>
                                    <b>{res.name}</b><br />
                                    <span className="text-capitalize">{res.type}</span>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-light text-danger">
                        {error || "Map unavailable"}
                    </div>
                )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 h-100">
                <h3 className="h6 fw-bold text-dark mb-4">{t('maps.features')}</h3>
                <div className="d-flex flex-column gap-3">
                    {features.map((feature, idx) => (
                        <div key={idx} className="btn btn-light text-start p-3 border-0 w-100 d-flex align-items-center gap-3 transition-all" style={{pointerEvents: 'none'}}>
                            <div className={`p-2 rounded-circle ${feature.bg} ${feature.color}`}>
                                <feature.icon size={20} />
                            </div>
                            <span className="fw-medium text-dark">{feature.label}</span>
                        </div>
                    ))}
                    
                    <div className="alert alert-info mt-3 small">
                        <Navigation size={16} className="me-2 inline" />
                        Showing simulated resources near your current location.
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;
