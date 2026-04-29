import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { QrCode, CreditCard, Smartphone, ArrowLeft } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

export default function TablePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  if (!formData) {
    return <Navigate to="/table" />;
  }

  const PRICE_PER_HEAD = 30;
  const total = formData.guests * PRICE_PER_HEAD;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/confirmation', { 
        state: { 
          ...formData,
          type: 'table',
          total,
          bookingId: `TBL-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
        }
      });
    }, 2500);
  };

  return (
    <PageWrapper className="main-content" style={{ gridTemplateColumns: '1fr', maxWidth: '600px', margin: '0 auto' }}>
      <button 
        className="btn-secondary" 
        style={{ border: 'none', marginBottom: '1rem', display: 'inline-flex', padding: '0.5rem', width: 'fit-content' }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Payment Details</h2>
        
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Booking Summary</h3>
          <div className="summary-row">
            <span>Guests</span>
            <span>{formData.guests} Persons</span>
          </div>
          <div className="summary-row">
            <span>Rate</span>
            <span>₹{PRICE_PER_HEAD} per head</span>
          </div>
          <div className="summary-row total" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
            <span>Total Payable</span>
            <span className="text-gradient" style={{ fontSize: '1.5rem' }}>₹{total}</span>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Select Payment Method</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <button 
              className={`radio-card ${paymentMethod === 'upi' ? 'active' : ''}`}
              style={{ padding: '1rem', border: paymentMethod === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: '8px', background: paymentMethod === 'upi' ? 'rgba(245, 158, 11, 0.1)' : 'transparent' }}
              onClick={() => setPaymentMethod('upi')}
            >
              <Smartphone size={24} style={{ margin: '0 auto 0.5rem', display: 'block', color: paymentMethod === 'upi' ? 'var(--primary)' : 'inherit' }} />
              <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>UPI</div>
            </button>
            <button 
              className={`radio-card ${paymentMethod === 'card' ? 'active' : ''}`}
              style={{ padding: '1rem', border: paymentMethod === 'card' ? '2px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: '8px', background: paymentMethod === 'card' ? 'rgba(245, 158, 11, 0.1)' : 'transparent' }}
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCard size={24} style={{ margin: '0 auto 0.5rem', display: 'block', color: paymentMethod === 'card' ? 'var(--primary)' : 'inherit' }} />
              <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>Card</div>
            </button>
            <button 
              className={`radio-card ${paymentMethod === 'scan' ? 'active' : ''}`}
              style={{ padding: '1rem', border: paymentMethod === 'scan' ? '2px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: '8px', background: paymentMethod === 'scan' ? 'rgba(245, 158, 11, 0.1)' : 'transparent' }}
              onClick={() => setPaymentMethod('scan')}
            >
              <QrCode size={24} style={{ margin: '0 auto 0.5rem', display: 'block', color: paymentMethod === 'scan' ? 'var(--primary)' : 'inherit' }} />
              <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>Scan & Pay</div>
            </button>
          </div>
        </div>

        {paymentMethod === 'scan' && (
          <div className="qr-container" style={{ marginBottom: '2rem' }}>
            <div className="qr-code-wrapper" style={{ margin: '0' }}>
              <QrCode size={150} color="var(--bg-dark)" />
              {isProcessing && <div className="scan-line"></div>}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>Scan using any UPI app</p>
          </div>
        )}

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
