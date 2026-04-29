import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Wine, Coffee, ArrowLeft } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

export default function PartyMenuSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const prevState = location.state;

  if (!prevState) {
    return <Navigate to="/party" />;
  }

  const handleSelect = (menuType) => {
    navigate(`/party/menu/${menuType}`, { 
      state: { 
        ...prevState,
        menuType
      } 
    });
  };

  return (
    <PageWrapper className="main-content" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        className="btn-secondary" 
        style={{ border: 'none', marginBottom: '1rem', display: 'inline-flex', padding: '0.5rem', width: 'fit-content' }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Choose Menu Type</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Applicable only for Party Hall Bookings</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <button 
            className="radio-card"
            style={{ width: '100%', border: 'none', background: 'transparent' }}
            onClick={() => handleSelect('liquor')}
          >
            <div className="radio-content hover-scale" style={{ height: '100%', padding: '2rem', border: '1px solid var(--border-color)' }}>
              <Wine size={48} className="radio-icon" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Liquor Menu</h3>
              <p style={{ color: 'var(--text-muted)' }}>Premium spirits, wines, beers, and expertly crafted cocktails.</p>
            </div>
          </button>

          <button 
            className="radio-card"
            style={{ width: '100%', border: 'none', background: 'transparent' }}
            onClick={() => handleSelect('non-liquor')}
          >
            <div className="radio-content hover-scale" style={{ height: '100%', padding: '2rem', border: '1px solid var(--border-color)' }}>
              <Coffee size={48} className="radio-icon" style={{ marginBottom: '1rem', color: 'var(--secondary)' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Non-Liquor Menu</h3>
              <p style={{ color: 'var(--text-muted)' }}>Delicious starters, main courses, desserts, and mocktails.</p>
            </div>
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
