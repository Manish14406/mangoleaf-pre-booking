import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

const EVENT_TYPES = [
  "Birthday Party", "Wedding Anniversary", "Engagement Party", 
  "Office Get-Together", "Team Outing", "Family Get-Together", 
  "Farewell Party", "Bachelor Party", "Bachelorette Party", 
  "Reunion Party", "Baby Shower", "Housewarming Party", 
  "Festival Celebration", "Corporate Event", "Promotion Celebration"
];

export default function PartySelection() {
  const navigate = useNavigate();

  const handleSelect = (eventType) => {
    navigate('/party/details', { state: { eventType } });
  };

  return (
    <PageWrapper className="main-content" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        className="btn-secondary" 
        style={{ border: 'none', marginBottom: '1rem', display: 'inline-flex', padding: '0.5rem', width: 'fit-content' }}
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Select Event Type</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {EVENT_TYPES.map((type, idx) => (
            <button 
              key={idx}
              className="btn-secondary"
              style={{ padding: '1rem', height: '100%', textAlign: 'center', transition: 'all 0.3s ease' }}
              onClick={() => handleSelect(type)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
