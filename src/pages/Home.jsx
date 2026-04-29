import { useNavigate } from 'react-router-dom';
import { Utensils, Music } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

export default function Home() {
  const navigate = useNavigate();

  return (
    <PageWrapper className="main-content" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>What would you like to book?</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <button 
            className="radio-card"
            style={{ width: '100%', border: 'none', background: 'transparent' }}
            onClick={() => navigate('/table')}
          >
            <div className="radio-content hover-scale" style={{ height: '100%', padding: '2rem' }}>
              <Utensils size={48} className="radio-icon" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Table Reservation</h3>
              <p style={{ color: 'var(--text-muted)' }}>Book a table for dining and drinks. Perfect for small groups.</p>
            </div>
          </button>

          <button 
            className="radio-card"
            style={{ width: '100%', border: 'none', background: 'transparent' }}
            onClick={() => navigate('/party')}
          >
            <div className="radio-content hover-scale" style={{ height: '100%', padding: '2rem' }}>
              <Music size={48} className="radio-icon" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Party Hall Booking</h3>
              <p style={{ color: 'var(--text-muted)' }}>Exclusive space for events and celebrations. Minimum 25 guests.</p>
            </div>
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
