import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Calendar, Clock, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

export default function PartyGuestDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const prevState = location.state;

  const [formData, setFormData] = useState({
    guests: 25,
    date: '',
    time: ''
  });

  if (!prevState) {
    return <Navigate to="/party" />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestChange = (e) => {
    const val = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, guests: isNaN(val) ? 0 : val }));
  };

  const handleGuestBlur = () => {
    if (formData.guests < 25) {
      setFormData(prev => ({ ...prev, guests: 25 }));
    } else if (formData.guests > 200) {
      setFormData(prev => ({ ...prev, guests: 200 }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.guests < 25 || formData.guests > 200) return;
    
    navigate('/party/menu-type', { 
      state: { 
        ...prevState,
        ...formData
      } 
    });
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Guest Details</h2>
          <p className="text-gradient">{prevState.eventType}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Number of Guests</label>
            <div style={{ position: 'relative' }}>
              <Users size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
              <input 
                type="number" 
                name="guests"
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                min={25}
                max={200}
                value={formData.guests}
                onChange={handleGuestChange}
                onBlur={handleGuestBlur}
                required
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Minimum: 25 | Maximum: 200 people
            </p>
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
            disabled={formData.guests < 25 || formData.guests > 200 || !formData.date || !formData.time}
          >
            Select Menu <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
