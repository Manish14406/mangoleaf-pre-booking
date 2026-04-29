import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, FileText, Download } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

export default function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  return (
    <PageWrapper className="main-content" style={{ gridTemplateColumns: '1fr', maxWidth: '600px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '3rem' }}>
        <div className="invoice-header">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="success-check">
              <CheckCircle size={32} />
            </div>
          </div>
          <h2 className="text-gradient">Booking Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Your reservation has been secured successfully.</p>
        </div>

        <div className="invoice-details">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <FileText size={20} />
              <span style={{ fontWeight: 'bold' }}>Booking ID: {state.bookingId || `BKG-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`}</span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleDateString()}</span>
          </div>

          <div className="invoice-row">
            <span style={{ color: 'var(--text-muted)' }}>Type</span>
            <span style={{ fontWeight: 'bold' }}>{state.type === 'party' ? 'Party Hall Booking' : 'Table Reservation'}</span>
          </div>
          
          {state.type === 'party' && state.eventType && (
            <div className="invoice-row">
              <span style={{ color: 'var(--text-muted)' }}>Event</span>
              <span>{state.eventType}</span>
            </div>
          )}

          <div className="invoice-row">
            <span style={{ color: 'var(--text-muted)' }}>Date & Time</span>
            <span>{state.date} at {state.time}</span>
          </div>
          <div className="invoice-row">
            <span style={{ color: 'var(--text-muted)' }}>Guests</span>
            <span>{state.guests} Persons</span>
          </div>
          
          {state.type === 'party' && state.menuType && (
            <div className="invoice-row">
              <span style={{ color: 'var(--text-muted)' }}>Menu Selection</span>
              <span style={{ textTransform: 'capitalize' }}>{state.menuType.replace('-', ' ')}</span>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border-color)' }}>
            <div className="invoice-row" style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Amount Paid</span>
              <span className="text-gradient">₹{state.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} />
            Download PDF
          </button>
          <button className="btn-primary" style={{ flex: 1, marginTop: 0 }} onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
        
        <div className="invoice-footer">
          <span style={{ fontSize: '0.875rem' }}>Show this confirmation at the entrance to claim your booking.</span>
        </div>
      </div>
    </PageWrapper>
  );
}
