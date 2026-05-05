import { useNavigate } from 'react-router-dom';
import { Utensils, Music } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import Card from '../components/Card';
import Section from '../components/Section';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Mango Leaf</h1>
          <div className="hero-subtitle">PUB & RESTAURANT</div>
        </div>
      </div>

      <PageWrapper className="main-content">
        <Section 
          title="Book Your Table or Party" 
          subtitle="Choose a booking type to get started"
        >
          <div className="desktop-grid mt-6">
            {/* Table Reservation Card */}
            <button
              onClick={() => navigate('/table')}
              style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%' }}
            >
              <Card className="hover-scale flex-center" style={{ flexDirection: 'column', height: '100%', padding: '2rem' }}>
                <div style={{ background: 'rgba(5, 150, 105, 0.15)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(5, 150, 105, 0.1)' }}>
                  <Utensils size={48} color="var(--primary)" />
                </div>
                <h3 className="mb-4">Table Booking</h3>
                <p className="text-secondary text-center">
                  Book a table for dining and drinks. Perfect for small groups.
                </p>
              </Card>
            </button>

            {/* Party Hall Card */}
            <button
              onClick={() => navigate('/party')}
              style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%' }}
            >
              <Card className="hover-scale flex-center" style={{ flexDirection: 'column', height: '100%', padding: '2rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)' }}>
                  <Music size={48} color="var(--accent)" />
                </div>
                <h3 className="mb-4">Party Hall Booking</h3>
                <p className="text-secondary text-center">
                  Exclusive space for events and celebrations. Minimum 25 guests.
                </p>
              </Card>
            </button>
          </div>
        </Section>
      </PageWrapper>
    </>
  );
}
