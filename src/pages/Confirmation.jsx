import { useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle, Home, Calendar, Clock, Users, Phone, User, Hash } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import Card from '../components/Card';
import Section from '../components/Section';
import Button from '../components/Button';
import { useBooking } from '../context/BookingContext';
import { generateWhatsAppLink } from '../utils/whatsapp';

export default function Confirmation() {
  const navigate = useNavigate();
  const { bookingData, setBookingData } = useBooking();

  if (!bookingData || !bookingData.name) {
    return <Navigate to="/" />;
  }

  const handleGoHome = () => {
    setBookingData({});
    navigate('/');
  };

  const isParty = bookingData.type === 'party';

  const detailRows = [
    bookingData.bookingId && { icon: Hash,     label: 'Booking ID',    value: bookingData.bookingId },
    bookingData.name      && { icon: User,     label: 'Name',          value: bookingData.name },
    bookingData.phone     && { icon: Phone,    label: 'Phone',         value: bookingData.phone },
    bookingData.people    && { icon: Users,    label: isParty ? 'Guests' : 'People', value: `${bookingData.people} persons` },
    bookingData.date      && { icon: Calendar, label: 'Date',          value: bookingData.date },
    bookingData.time      && { icon: Clock,    label: 'Session / Time', value: bookingData.time },
    isParty && bookingData.eventType  && { icon: null, label: 'Event Type',  value: bookingData.eventType },
    isParty && bookingData.menuType   && { icon: null, label: 'Menu',        value: bookingData.menuType.replace('-', ' ') },
  ].filter(Boolean);

  return (
    <PageWrapper className="main-content" style={{ maxWidth: '600px' }}>
      <Card className="text-center" style={{ padding: '3rem 2rem' }}>
        <div className="flex-center mb-6">
          <div style={{
            background: 'rgba(5, 150, 105, 0.2)',
            color: 'var(--accent)',
            padding: '1.5rem',
            borderRadius: '50%',
            boxShadow: '0 0 30px rgba(5, 150, 105, 0.2)'
          }}>
            <CheckCircle size={48} />
          </div>
        </div>

        <h2 className="mb-2 text-gradient" style={{ fontSize: '2.5rem' }}>
          Booking Confirmed!
        </h2>
        <p className="text-secondary mb-8" style={{ fontSize: '1.1rem' }}>
          {isParty
            ? 'Your party hall has been successfully reserved.'
            : 'Your table has been successfully reserved.'}
        </p>

        <div style={{
          textAlign: 'left',
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <h4 className="text-secondary mb-4 uppercase" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
            Booking Details
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {detailRows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex-between pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-secondary flex-center" style={{ gap: '0.5rem', fontSize: '0.95rem' }}>
                  {Icon && <Icon size={16} />}
                  {label}
                </span>
                <span className="font-medium" style={{ textAlign: 'right', textTransform: 'capitalize', fontSize: '1rem' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {bookingData.total != null && (
            <>
              {isParty && bookingData.advance && (
                <div className="flex-between mt-4 pt-2" style={{ borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                  <span className="text-secondary font-medium">Total Bill</span>
                  <span className="font-medium" style={{ fontSize: '1.1rem' }}>
                    ₹{bookingData.total}
                  </span>
                </div>
              )}
              <div className="flex-between mt-3">
                <span className="text-secondary font-medium">{isParty ? 'Advance Paid (50%)' : 'Total Paid'}</span>
                <span className="text-gradient font-bold" style={{ fontSize: '1.5rem' }}>
                  ₹{isParty ? bookingData.advance : bookingData.total}
                </span>
              </div>
            </>
          )}
        </div>

        {!isParty && (
          <div style={{
            background: 'rgba(5, 150, 105, 0.1)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '2rem',
            color: 'var(--accent)',
            fontWeight: 500
          }}>
            🎁 Show this confirmation at the pub to claim your <strong>10% discount</strong>!
          </div>
        )}

        <a
          href={generateWhatsAppLink(isParty ? "party" : "table", bookingData)}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn flex-center"
          style={{ width: '100%', marginBottom: '1rem', padding: '16px', gap: '0.5rem', fontSize: '1.1rem' }}
        >
          📱 Send Confirmation on WhatsApp
        </a>

        <Button onClick={handleGoHome} style={{ padding: '16px', fontSize: '1.1rem' }}>
          <Home size={20} className="mr-2" /> Back to Home
        </Button>
      </Card>
    </PageWrapper>
  );
}
