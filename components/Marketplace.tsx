import React, { useState, useEffect } from 'react';
import { ShoppingBag, Tag, MapPin, Plus, Loader2, Tractor, Sprout, Search, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../services/dbService';
import { MarketItem } from '../types';

const Marketplace: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'CROP' | 'EQUIPMENT'>('ALL');
  const [showSellModal, setShowSellModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '',
    type: 'CROP',
    price: '',
    unit: '',
    location: '',
    description: '',
    contact: ''
  });

  const user = db.users.getSession();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const fetchedItems = await db.market.findAll();
      setItems(fetchedItems);
    } catch (error) {
      console.error("Failed to fetch market items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const item: MarketItem = {
        id: Date.now().toString(),
        sellerId: user.id,
        sellerName: user.name,
        type: newItem.type as 'CROP' | 'EQUIPMENT',
        name: newItem.name,
        price: parseFloat(newItem.price),
        unit: newItem.unit,
        location: newItem.location || user.location,
        description: newItem.description,
        contact: newItem.contact || user.phone,
        timestamp: Date.now()
      };

      await db.market.create(item);
      setShowSellModal(false);
      setNewItem({
        name: '',
        type: 'CROP',
        price: '',
        unit: '',
        location: '',
        description: '',
        contact: ''
      });
      fetchItems();
    } catch (error) {
      console.error("Failed to list item:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'ALL') return true;
    return item.type === filter;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Loader2 className="animate-spin text-success" size={48} />
      </div>
    );
  }

  return (
    <>
      <div className="d-flex flex-column gap-4 animate-fade-in pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h2 className="h4 fw-bold text-dark m-0">{t('market.title')}</h2>
          <p className="text-muted small m-0">{t('market.buy')} & {t('market.sell')} {t('market.crops')} & {t('market.equipment')}</p>
        </div>
        <button 
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={() => setShowSellModal(true)}
        >
          <Plus size={18} />
          {t('market.sell')}
        </button>
      </div>

      {/* Filters */}
      <div className="d-flex gap-2 overflow-auto pb-2">
        <button 
          className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${filter === 'ALL' ? 'btn-success' : 'btn-outline-secondary border-0 bg-white'}`}
          onClick={() => setFilter('ALL')}
        >
          <ShoppingBag size={16} />
          All
        </button>
        <button 
          className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${filter === 'CROP' ? 'btn-success' : 'btn-outline-secondary border-0 bg-white'}`}
          onClick={() => setFilter('CROP')}
        >
          <Sprout size={16} />
          {t('market.crops')}
        </button>
        <button 
          className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${filter === 'EQUIPMENT' ? 'btn-success' : 'btn-outline-secondary border-0 bg-white'}`}
          onClick={() => setFilter('EQUIPMENT')}
        >
          <Tractor size={16} />
          {t('market.equipment')}
        </button>
      </div>

      {/* Grid */}
      <div className="row g-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className={`badge ${item.type === 'CROP' ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'} rounded-pill`}>
                      {item.type === 'CROP' ? t('market.crops') : t('market.equipment')}
                    </span>
                    <small className="text-muted">{new Date(item.timestamp).toLocaleDateString()}</small>
                  </div>
                  
                  <h5 className="card-title fw-bold text-dark mb-1">{item.name}</h5>
                  <h6 className="text-success fw-bold mb-3">₹{item.price} <small className="text-muted fw-normal">/ {item.unit}</small></h6>
                  
                  <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                    <MapPin size={14} />
                    {item.location}
                  </div>
                  
                  <p className="text-muted small mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-light rounded-circle p-1 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                         <span className="fw-bold text-secondary" style={{fontSize: '12px'}}>{item.sellerName.charAt(0)}</span>
                      </div>
                      <small className="text-dark fw-medium">{item.sellerName}</small>
                    </div>
                    <a href={`tel:${item.contact}`} className="btn btn-sm btn-outline-success d-flex align-items-center gap-1">
                      <Phone size={14} />
                      {t('market.contact')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5 text-muted">
            <ShoppingBag size={48} className="mb-3 opacity-50" />
            <p>{t('market.noItems')}</p>
          </div>
        )}
      </div>

      </div>

      {/* Sell Modal */}
      {showSellModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">{t('market.postItem')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowSellModal(false)}></button>
              </div>
              <form onSubmit={handleSell}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small text-muted">{t('market.itemType')}</label>
                    <select 
                      className="form-select"
                      value={newItem.type}
                      onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                    >
                      <option value="CROP">{t('market.crops')}</option>
                      <option value="EQUIPMENT">{t('market.equipment')}</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">{t('market.itemName')}</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-muted">{t('market.price')} (₹)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        required
                        value={newItem.price}
                        onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted">{t('market.unit')}</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required
                        placeholder="kg, quintal, hour"
                        value={newItem.unit}
                        onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">{t('market.location')}</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder={user?.location}
                      value={newItem.location}
                      onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">{t('market.contact')}</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder={user?.phone}
                      value={newItem.contact}
                      onChange={(e) => setNewItem({...newItem, contact: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">{t('market.description')}</label>
                    <textarea 
                      className="form-control" 
                      rows={3}
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowSellModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success" disabled={submitting}>
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : t('market.sell')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Marketplace;
