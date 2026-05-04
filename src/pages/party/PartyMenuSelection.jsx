import { useNavigate, Navigate } from 'react-router-dom';
import { Wine, Coffee, ArrowLeft } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Button from '../../components/Button';
import { useBooking } from '../../context/BookingContext';

export default function PartyMenuSelection() {
  const navigate = useNavigate();
  const { bookingData, setBookingData } = useBooking();

  if (!bookingData || !bookingData.eventType || !bookingData.name) {
    return <Navigate to="/party" />;
  }

  const handleSelect = (menuType) => {
    setBookingData(prev => ({ ...prev, menuType }));
    navigate(`/party/menu/${menuType}`);
  };

  return (
    <PageWrapper className="main-content">
      <div className="progress-container">
        <div className="progress-line"></div>
        <div className="progress-step completed">1</div>
        <div className="progress-step completed">2</div>
        <div className="progress-step active">3</div>
        <div className="progress-step">4</div>
      </div>

      <Button
        variant="secondary"
        className="mb-6"
        style={{ width: 'fit-content' }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} /> Back
      </Button>

      <Card>
        <Section 
          title="Choose Menu Type" 
          subtitle="Applicable only for Party Hall Bookings"
          className="mb-8"
        />

        <div className="desktop-grid">
          <button
            onClick={() => handleSelect('liquor')}
            style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%' }}
          >
            <Card className="hover-scale flex-center" style={{ flexDirection: 'column', height: '100%', padding: '2rem' }}>
              <div style={{ background: 'rgba(22, 163, 74, 0.1)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <Wine size={48} color="var(--primary)" />
              </div>
              <h3 className="mb-4">Liquor Menu</h3>
              <p className="text-secondary text-center">
                Premium spirits, wines, beers, and expertly crafted cocktails.
              </p>
            </Card>
          </button>

          <button
            onClick={() => handleSelect('non-liquor')}
            style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%' }}
          >
            <Card className="hover-scale flex-center" style={{ flexDirection: 'column', height: '100%', padding: '2rem' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <Coffee size={48} color="var(--accent)" />
              </div>
              <h3 className="mb-4">Non-Liquor Menu</h3>
              <p className="text-secondary text-center">
                Delicious starters, main courses, desserts, and mocktails.
              </p>
            </Card>
          </button>
        </div>
      </Card>
    </PageWrapper>
  );
}
