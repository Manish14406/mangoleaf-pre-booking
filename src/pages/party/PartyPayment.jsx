import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { QrCode, CreditCard, Smartphone, ArrowLeft } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';
import { useBooking } from '../../context/BookingContext';
import { supabase } from '../../lib/supabase';

export default function PartyPayment() {
  const navigate = useNavigate();
  const { bookingData, setBookingData } = useBooking();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Guard
  if (!bookingData || !bookingData.menuType || !bookingData.name) {
    return <Navigate to="/party" />;
  }

  const PARTY_ADVANCE = 5000;

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Update context first
      const updatedBooking = {
        ...bookingData,
        type: 'party',
        total: PARTY_ADVANCE,
        bookingId: `PTY-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, '0')}`,
      };

      setBookingData(updatedBooking);

      // 🔥 Insert into Supabase
      const { error } = await supabase.from('bookings').insert([
        {
          type: 'party',
          name: updatedBooking.name,
          phone: updatedBooking.phone,
          people: updatedBooking.people,
          date: updatedBooking.date,
          time: updatedBooking.time,
          total: PARTY_ADVANCE,
          status: 'confirmed',
        },
      ]);

      // ✅ FIXED ERROR HANDLING
      if (error) {
        console.error('Insert error:', error);

        // 🔥 Duplicate booking
        if (error.code === '23505') {
          alert('You already booked this slot!');
        } else {
          alert('Booking failed. Please try again.');
        }

        setIsProcessing(false); // important
        return;
      }

      // Success
      navigate('/confirmation');

    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Something went wrong!');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageWrapper
      className="main-content"
      style={{ gridTemplateColumns: '1fr', maxWidth: '600px', margin: '0 auto' }}
    >
      <button
        className="btn-secondary"
        style={{ border: 'none', marginBottom: '1rem', display: 'inline-flex', padding: '0.5rem' }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          Final Payment
        </h2>

        {/* Summary */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.5rem'
          }}>
            Booking Summary
          </h3>

          <div className="summary-row">
            <span>Event Type</span>
            <span>{bookingData.eventType}</span>
          </div>

          <div className="summary-row">
            <span>Guests</span>
            <span>{bookingData.people}</span>
          </div>

          <div className="summary-row">
            <span>Date</span>
            <span>{bookingData.date}</span>
          </div>

          <div className="summary-row">
            <span>Session</span>
            <span>{bookingData.time}</span>
          </div>

          <div className="summary-row">
            <span>Menu</span>
            <span>{bookingData.menuType}</span>
          </div>

          <div className="summary-row total" style={{ marginTop: '1rem' }}>
            <span>Advance</span>
            <span style={{ fontSize: '1.4rem' }}>₹{PARTY_ADVANCE}</span>
          </div>
        </div>

        {/* Payment options */}
        <div style={{ marginBottom: '2rem' }}>
          <h4>Select Payment Method</h4>

          <div className="grid-3col">
            <button onClick={() => setPaymentMethod('upi')}>
              <Smartphone /> UPI
            </button>
            <button onClick={() => setPaymentMethod('card')}>
              <CreditCard /> Card
            </button>
            <button onClick={() => setPaymentMethod('scan')}>
              <QrCode /> Scan
            </button>
          </div>
        </div>

        {/* QR */}
        {paymentMethod === 'scan' && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <QrCode size={140} />
            <p>Scan to pay ₹{PARTY_ADVANCE}</p>
          </div>
        )}

        {/* Pay */}
        <button
          className="btn-primary"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ₹${PARTY_ADVANCE}`}
        </button>
      </div>
    </PageWrapper>
  );
}