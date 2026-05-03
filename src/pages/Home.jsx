import { useNavigate } from 'react-router-dom';
import { Utensils, Music } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';




export default function Home() {
  const navigate = useNavigate();

  return (
    <PageWrapper
      className="main-content"
      style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}
    >
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '0.5rem', fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>
          What would you like to book?
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Choose a booking type to get started
        </p>

        {/* Responsive 2-col grid → 1-col on mobile */}
        <div className="grid-2col">

          {/* Table Reservation Card */}
          <button
            className="radio-card"
            style={{ width: '100%', border: 'none', background: 'transparent' }}
            onClick={() => navigate('/table')}
          >
            <div
              className="radio-content hover-scale"
              style={{ height: '100%', padding: 'clamp(1.25rem, 4vw, 2rem)' }}
            >
              <Utensils
                size={44}
                className="radio-icon"
                style={{ marginBottom: '1rem' }}
              />
              <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', marginBottom: '0.5rem' }}>
                Table Reservation
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Book a table for dining and drinks. Perfect for small groups.
              </p>
            </div>
          </button>

          {/* Party Hall Card */}
          <button
            className="radio-card"
            style={{ width: '100%', border: 'none', background: 'transparent' }}
            onClick={() => navigate('/party')}
          >
            <div
              className="radio-content hover-scale"
              style={{ height: '100%', padding: 'clamp(1.25rem, 4vw, 2rem)' }}
            >
              <Music
                size={44}
                className="radio-icon"
                style={{ marginBottom: '1rem', color: 'var(--secondary)' }}
              />
              <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', marginBottom: '0.5rem' }}>
                Party Hall Booking
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Exclusive space for events and celebrations. Minimum 25 guests.
              </p>
            </div>
          </button>

        </div>
      </div>
    </PageWrapper>
  );
}

