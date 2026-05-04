import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { QrCode, CreditCard, Smartphone, ArrowLeft } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Button from '../../components/Button';
import { useBooking } from '../../context/BookingContext';
import { supabase } from '../../lib/supabase';

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export default function TablePayment() {
  const navigate = useNavigate();
  const { bookingData } = useBooking();

  const [isProcessing, setIsProcessing] = useState(false);

  if (!bookingData || !bookingData.name) {
    return <Navigate to="/table" />;
  }

  const total = bookingData.total;

  const handlePayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const { data, error: bookedError } = await supabase
        .from('table_bookings')
        .select('table_id, status')
        .eq('date', bookingData.date)
        .eq('time', bookingData.time);

      if (bookedError) {
        console.error(bookedError);
        alert(bookedError.message);
        setIsProcessing(false);
        return;
      }

      const bookedIds = (data || [])
        .filter(item => item.status === 'confirmed')
        .map(item => item.table_id)
        .filter(id => id !== null);

      const { data: tables, error: tablesError } = await supabase
        .from('tables')
        .select('id');

      if (tablesError) {
        console.error(tablesError);
        alert('Error fetching tables');
        setIsProcessing(false);
        return;
      }

      const availableTable = tables.find(
        table => !bookedIds.includes(table.id)
      );

      if (!availableTable) {
        alert("No tables available");
        setIsProcessing(false);
        return;
      }

      const { data: pendingBooking, error: pendingError } = await supabase
        .from('table_bookings')
        .insert([
          {
            table_id: availableTable.id,
            name: bookingData.name,
            phone: bookingData.phone,
            people: bookingData.people,
            date: bookingData.date,
            time: bookingData.time,
            total: bookingData.total,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (pendingError) {
        console.error("FULL ERROR:", pendingError);
        if (pendingError.code === '23505') {
          alert("Table just got booked by someone else. Try again.");
        } else {
          alert("Booking failed. Try again.");
        }
        setIsProcessing(false);
        return;
      }

      const fnResponse = await fetch(
        `${SUPABASE_URL}/functions/v1/create-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ amount: total }),
        }
      );

      const orderData = await fnResponse.json();

      if (!fnResponse.ok || !orderData?.id) {
        await supabase
          .from('table_bookings')
          .delete()
          .eq('id', pendingBooking.id);

        alert(
          orderData?.error
            ? `Payment init failed: ${orderData.error}`
            : 'Failed to initialize payment. Check Razorpay secrets.'
        );
        setIsProcessing(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Mangoleaf PUB",
        description: "Table Booking",
        order_id: orderData.id,
        handler: async function (response) {
          setIsProcessing(true);

          try {
            const { error } = await supabase
              .from('table_bookings')
              .update({
                status: 'confirmed',
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id
              })
              .eq('id', pendingBooking.id);

            if (error) {
              console.error("CONFIRM ERROR:", error);
              alert(error.message);
              setIsProcessing(false);
              return;
            }

            navigate('/confirmation');

          } catch (err) {
            console.error("UNEXPECTED ERROR:", err);
            alert("Unexpected error after payment");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: bookingData.name,
          contact: bookingData.phone
        },
        theme: {
          color: "#16a34a"
        },
        modal: {
          ondismiss: async function () {
            await supabase
              .from('table_bookings')
              .delete()
              .eq('id', pendingBooking.id);
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', async function () {
        await supabase
          .from('table_bookings')
          .delete()
          .eq('id', pendingBooking.id);

        alert('Payment failed. Try again.');
        setIsProcessing(false);
      });

      try {
        rzp.open();
      } catch (err) {
        await supabase
          .from('table_bookings')
          .delete()
          .eq('id', pendingBooking.id);

        alert("Payment failed to start");
        setIsProcessing(false);
      }

    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Something went wrong!');
      setIsProcessing(false);
    }
  };

  return (
    <PageWrapper className="main-content" style={{ maxWidth: '600px' }}>
      <Button
        variant="secondary"
        className="mb-6"
        style={{ width: 'fit-content' }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} /> Back
      </Button>

      <Card>
        <Section title="Payment Details" className="mb-6" />

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
            <span className="text-secondary">Name</span>
            <span className="font-medium">{bookingData.name}</span>
          </div>

          <div className="flex-between mb-4">
            <span className="text-secondary">People</span>
            <span className="font-medium">{bookingData.people}</span>
          </div>

          <div className="flex-between mb-4">
            <span className="text-secondary">Date</span>
            <span className="font-medium">{bookingData.date}</span>
          </div>

          <div className="flex-between mb-4">
            <span className="text-secondary">Time</span>
            <span className="font-medium">{bookingData.time}</span>
          </div>

          <div className="flex-between mt-6 pt-4" style={{ borderTop: '1px dashed var(--border-color)' }}>
            <span className="font-bold text-primary">Total Amount</span>
            <span className="font-bold text-primary" style={{ fontSize: '1.5rem' }}>₹{total}</span>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          style={{ fontSize: '1.1rem', padding: '16px' }}
        >
          {isProcessing ? 'Processing...' : `Pay ₹${total}`}
        </Button>
      </Card>
    </PageWrapper>
  );
}
