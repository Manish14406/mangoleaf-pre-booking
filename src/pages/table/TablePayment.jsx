import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { QrCode, CreditCard, Smartphone, ArrowLeft } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';
import { useBooking } from '../../context/BookingContext';
import { supabase } from '../../lib/supabase';

// ✅ Anon key for unauthenticated edge function calls
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export default function TablePayment() {
  const navigate = useNavigate();
  const { bookingData } = useBooking();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Guard
  if (!bookingData || !bookingData.name) {
    return <Navigate to="/table" />;
  }

  const total = bookingData.total;

  const handlePayment = async () => {
    // 🔥 prevent double click
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      // 🔹 Fetch bookings
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

      // 🔹 Only CONFIRMED bookings block tables
      const bookedIds = (data || [])
        .filter(item => item.status === 'confirmed')
        .map(item => item.table_id)
        .filter(id => id !== null);

      // 🔹 Fetch all tables
      const { data: tables, error: tablesError } = await supabase
        .from('tables')
        .select('id');

      if (tablesError) {
        console.error(tablesError);
        alert('Error fetching tables');
        setIsProcessing(false);
        return;
      }

      // 🔹 Find available table
      const availableTable = tables.find(
        table => !bookedIds.includes(table.id)
      );

      // 🔥 check BEFORE insert
      if (!availableTable) {
        alert("No tables available");
        setIsProcessing(false);
        return;
      }
      
          console.log("BOOKING DATA:", {
      table_id: availableTable?.id,
      name: bookingData?.name,
      phone: bookingData?.phone,
      people: bookingData?.people,
      date: bookingData?.date,
      time: bookingData?.time,
      total: bookingData?.total
      });

      // 🔹 Lock table (pending)
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

          console.log("INSERT RESPONSE:", pendingBooking);
           console.log("INSERT ERROR:", pendingError);

      if (pendingError) {
  console.error("FULL ERROR:", pendingError);
  alert(pendingError.message);

  if (pendingError.code === '23505') {
    alert("Table just got booked by someone else. Try again.");
  } else {
    alert("Booking failed. Try again.");
  }

  setIsProcessing(false);
  return;
}
      // 🔹 Create Razorpay order via Edge Function
      // We call the function directly with fetch so it works for anonymous users
      const fnResponse = await fetch(
        `${SUPABASE_URL}/functions/v1/create-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // ✅ Use anon key — this is safe for unauthenticated users
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ amount: total }),
        }
      );

      const orderData = await fnResponse.json();
      console.log('📦 ORDER DATA:', orderData);

      // ✅ Validate that we got a real Razorpay order id back
      if (!fnResponse.ok || !orderData?.id) {
        console.error('Order creation failed:', orderData);

        // cleanup pending booking
        await supabase
          .from('table_bookings')
          .delete()
          .eq('id', pendingBooking.id);

        alert(
          orderData?.error
            ? `Payment init failed: ${orderData.error}`
            : 'Failed to initialize payment. Check Razorpay secrets in Supabase Dashboard.'
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
            // 🔹 Confirm booking
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

        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },

        theme: {
          color: "#d97706"
        },

        modal: {
          ondismiss: async function () {
            // 🔹 cleanup if user closes popup
            await supabase
              .from('table_bookings')
              .delete()
              .eq('id', pendingBooking.id);

            setIsProcessing(false);
          }
        }
      };

      console.log('✅ ORDER DATA:', orderData);
      console.log('✅ KEY:', import.meta.env.VITE_RAZORPAY_KEY_ID);

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', async function () {
        await supabase
          .from('table_bookings')
          .delete()
          .eq('id', pendingBooking.id);

        alert('Payment failed. Try again.');
        setIsProcessing(false);
      });

      // 🔥 handle open failure
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
    <PageWrapper
      className="main-content"
      style={{ gridTemplateColumns: '1fr', maxWidth: '560px', margin: '0 auto' }}
    >
      <button
        className="btn-secondary"
        style={{ marginBottom: '1rem' }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="glass-panel">
        <h2 style={{ textAlign: 'center' }}>Payment Details</h2>

        <button
          className="btn-primary"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ₹${total}`}
        </button>
      </div>
    </PageWrapper>
  );
}

