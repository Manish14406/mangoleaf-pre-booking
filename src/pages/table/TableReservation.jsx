import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, User, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

export default function TableReservation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: 1,
    date: '',
    time: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestChange = (e) => {
    const val = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, guests: isNaN(val) ? 0 : val }));
  };

  const handleGuestBlur = () => {
    if (formData.guests < 1) {
      setFormData(prev => ({ ...prev, guests: 1 }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.guests < 1) return;
    navigate('/table/payment', { state: formData });
  };

  return (
    <PageWrapper className="main-content" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        className="btn-secondary" 
        style={{ border: 'none', marginBottom: '1rem', display: 'inline-flex', padding: '0.5rem', width: 'fit-content' }}
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back
      </button>

      <div className="glass-panel reservation-form">
        <h2 style={{ marginBottom: '1.5rem' }}>Table Reservation Details</h2>
        
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--secondary)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>Special Offer</h4>
          <p style={{ fontSize: '0.9rem' }}>You will receive a <strong>10% discount at the pub</strong>. Just show your booking confirmation!</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  name="name"
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
                <input 
                  type="tel" 
                  name="phone"
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Number of People</label>
            <div style={{ position: 'relative' }}>
              <Users size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
              <input 
                type="number" 
                name="guests"
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                min={1}
                value={formData.guests}
                onChange={handleGuestChange}
                onBlur={handleGuestBlur}
                required
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>₹30 per head booking fee</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
                <input 
                  type="date" 
                  name="date"
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Time</label>
              <div style={{ position: 'relative' }}>
                <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
                <input 
                  type="time" 
                  name="time"
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="btn-primary" 
            disabled={!formData.name || !formData.phone || formData.guests < 1 || !formData.date || !formData.time}
          >
            Continue to Payment <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
