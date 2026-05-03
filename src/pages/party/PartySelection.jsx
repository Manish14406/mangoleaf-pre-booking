import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';
import { useBooking } from '../../context/BookingContext';

// All selectable event types for the party hall
const EVENT_TYPES = [
  '🎂 Birthday Party',       '💍 Wedding Anniversary',  '💎 Engagement Party',
  '🏢 Office Get-Together',  '🤝 Team Outing',          '👨‍👩‍👧 Family Gathering',
  '👋 Farewell Party',       '🥂 Bachelor Party',       '💃 Bachelorette Party',
  '🔁 Reunion Party',        '🍼 Baby Shower',          '🏠 Housewarming',
  '🎉 Festival Celebration', '📊 Corporate Event',      '🏆 Promotion Celebration',
];

export default function PartySelection() {
  const navigate = useNavigate();
  const { bookingData, setBookingData } = useBooking();

  const handleSelect = (eventType) => {
    // Save into global context — no route state needed
    setBookingData({ ...bookingData, type: 'party', eventType });
    navigate('/party/details');
  };

  return (
    <PageWrapper
      className="main-content"
      style={{ gridTemplateColumns: '1fr', maxWidth: '860px', margin: '0 auto' }}
    >
      {/* Back */}
      <button
        className="btn-secondary"
        style={{ marginBottom: '1rem', width: 'fit-content' }}
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="glass-panel">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', marginBottom: '0.4rem' }}>
            Select Event Type
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Choose the occasion for your party hall booking
          </p>
        </div>

        {/* Auto-fill responsive grid — 1 col on mobile, up to 3 on desktop */}
        <div className="event-grid">
          {EVENT_TYPES.map((type) => (
            <button
              key={type}
              className="event-btn"
              onClick={() => handleSelect(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
