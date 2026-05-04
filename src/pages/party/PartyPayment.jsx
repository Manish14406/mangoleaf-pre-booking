import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Button from '../../components/Button';
import { useBooking } from '../../context/BookingContext';
import { supabase } from '../../lib/supabase';

export default function PartyPayment() {
  const navigate = useNavigate();
  const { bookingData, setBookingData } = useBooking();

  const [isProcessing, setIsProcessing] = useState(false);

  if (!bookingData || !bookingData.menuType || !bookingData.name) {
    return <Navigate to="/party" />;
  }

  const totalAmount = bookingData.total || 5000;
  const advanceAmount = bookingData.advance || Math.round(totalAmount * 0.5);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      if (!bookingData.name || !bookingData.phone || !advanceAmount) {
        alert("Missing booking data");
        setIsProcessing(false);
        return;
      }

      const { data, error: functionError } = await supabase.functions.invoke("create-order", {
        body: { amount: advanceAmount }
      });

      if (functionError) {
        console.error('Edge function error:', functionError);
        alert('Failed to initialize payment.');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Mango Leaf",
        description: "Party Booking",
        order_id: data.id,
        handler: async function (response) {
          const insertPayload = {
            name: bookingData.name,
            phone: bookingData.phone,
            guests: Number(bookingData.guests || bookingData.people),
            date: bookingData.date,
            time: bookingData.time,
            menu_type: bookingData.partyType || bookingData.menuType || bookingData.eventType,
            total: Number(totalAmount),
            advance_paid: Number(advanceAmount),
            status: "confirmed"
          };

          const { error } = await supabase
            .from("party_bookings")
            .insert([insertPayload])
            .select();

          if (error) {
            console.error("SUPABASE INSERT ERROR:", error);
            alert(error.message);
            setIsProcessing(false);
            return;
          }

          setBookingData({
            ...bookingData,
            type: 'party',
            total: totalAmount,
            advance: advanceAmount,
            bookingId: `PTY-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            paymentId: response.razorpay_payment_id
          });

          navigate("/confirmation");
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        alert("Payment failed. Try again.");
        setIsProcessing(false);
      });
      rzp.open();

    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Something went wrong!');
      setIsProcessing(false);
    }
  };

  return (
    <PageWrapper className="main-content">
      <div className="progress-container">
        <div className="progress-line"></div>
        <div className="progress-step completed">1</div>
        <div className="progress-step completed">2</div>
        <div className="progress-step completed">3</div>
        <div className="progress-step active">4</div>
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
        <Section title="Final Payment" className="mb-6" />

        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem'
        }}>
          <h3 className="mb-4" style={{
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.75rem'
          }}>
            Booking Summary
          </h3>

          <div className="flex-between mb-4">
            <span className="text-secondary">Event Type</span>
            <span className="font-medium text-right">{bookingData.eventType}</span>
          </div>

          <div className="flex-between mb-4">
            <span className="text-secondary">Guests</span>
            <span className="font-medium">{bookingData.people}</span>
          </div>

          <div className="flex-between mb-4">
            <span className="text-secondary">Date</span>
            <span className="font-medium">{bookingData.date}</span>
          </div>

          <div className="flex-between mb-4">
            <span className="text-secondary">Session</span>
            <span className="font-medium text-right">{bookingData.time === 'morning' ? '12:00 PM - 3:00 PM' : bookingData.time === 'night' ? '7:00 PM - 11:00 PM' : bookingData.time}</span>
          </div>

          <div className="flex-between mb-4">
            <span className="text-secondary">Menu</span>
            <span className="font-medium" style={{ textTransform: 'capitalize' }}>{bookingData.menuType}</span>
          </div>

          <div className="flex-between mb-4 mt-6">
            <span className="text-secondary">Base Food Total</span>
            <span className="font-medium">₹{bookingData.baseTotal || 0}</span>
          </div>

          {(bookingData.menuType === 'liquor' || bookingData.liquorCharge > 0) && (
            <div className="flex-between mb-4">
              <span className="text-secondary">Liquor Charge (10%)</span>
              <span className="font-medium">₹{bookingData.liquorCharge || 0}</span>
            </div>
          )}

          <div className="flex-between mt-6 pt-4" style={{ borderTop: '1px dashed var(--border-color)' }}>
            <span className="font-medium">Total Bill</span>
            <span className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 600 }}>₹{totalAmount}</span>
          </div>

          <div className="flex-between mt-4">
            <span className="font-bold text-primary">Advance (50%)</span>
            <span className="font-bold text-primary" style={{ fontSize: '1.5rem' }}>₹{advanceAmount}</span>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          style={{ fontSize: '1.1rem', padding: '16px' }}
        >
          {isProcessing ? 'Processing...' : `Pay Advance ₹${advanceAmount}`}
        </Button>
      </Card>
    </PageWrapper>
  );
}