import { useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle, Home, Calendar, Clock, Users, Phone, User, Hash } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useBooking } from '../context/BookingContext';

export default function Confirmation() {
  const navigate = useNavigate();
  const { bookingData, setBookingData } = useBooking();

  // Guard: redirect if accessed directly
  if (!bookingData || !bookingData.name) {
    return <Navigate to="/" />;
  }

  const handleGoHome = () => {
    // Clear context so back button on other pages can't return to a stale state
    setBookingData({});
    navigate('/');
  };

  // Build rows from bookingData — only show fields that exist
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
    <PageWrapper
      className="main-content"
      style={{ gridTemplateColumns: '1fr', maxWidth: '540px', margin: '0 auto' }}
    >
      <div className="glass-panel" style={{ textAlign: 'center' }}>

        {/* Success icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div className="success-check">
            <CheckCircle size={32} />
          </div>
        </div>

        <h2 style={{ marginBottom: '0.4rem', fontSize: 'clamp(1.4rem, 5vw, 1.9rem)' }}>
          🎉 Booking Confirmed!
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          {isParty
            ? 'Your party hall has been successfully reserved.'
            : 'Your table has been successfully reserved.'}
        </p>

        {/* ── Booking Details Card ──────────────── */}
        <div style={{
          textAlign: 'left',
          background: 'rgba(15, 23, 42, 0.55)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.75rem',
        }}>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '1rem',
          }}>
            Booking Details
          </p>

          {detailRows.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.6rem 0',
                borderBottom: '1px solid var(--border-color)',
                gap: '1rem',
              }}
            >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-muted)',
                fontSize: '0.88rem',
                minWidth: 0,
              }}>
                {Icon && <Icon size={14} style={{ flexShrink: 0 }} />}
                {label}
              </span>
              <span style={{
                fontWeight: 500,
                fontSize: '0.9rem',
                textAlign: 'right',
                textTransform: 'capitalize',
                wordBreak: 'break-word',
              }}>
                {value}
              </span>
            </div>
          ))}

          {/* Total paid */}
          {bookingData.total != null && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0 0',
              marginTop: '0.25rem',
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Total Paid
              </span>
              <span className="text-gradient" style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                ₹{bookingData.total}
              </span>
            </div>
          )}
        </div>

        {/* ── Discount notice for table bookings ── */}
        {!isParty && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: 'var(--secondary)',
          }}>
            🎁 Show this confirmation at the pub to claim your <strong>10% discount</strong>!
          </div>
        )}

        {/* ── Back to Home ─────────────────────── */}
        <button
          className="btn-primary"
          onClick={handleGoHome}
          style={{ marginTop: 0 }}
        >
          <Home size={18} /> Back to Home
        </button>

      </div>
    </PageWrapper>
  );
}