import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Section from '../../components/Section';
import { useBooking } from '../../context/BookingContext';

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
    setBookingData({ ...bookingData, type: 'party', eventType });
    navigate('/party/details');
  };

  return (
    <PageWrapper className="main-content" style={{ maxWidth: '860px' }}>
      <Button
        variant="secondary"
        className="mb-6"
        style={{ width: 'fit-content' }}
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={18} /> Back
      </Button>

      <Card>
        <Section 
          title="Select Event Type" 
          subtitle="Choose the occasion for your party hall booking"
          className="mb-8"
        />

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
      </Card>
    </PageWrapper>
  );
}
