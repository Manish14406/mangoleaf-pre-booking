import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, User, Phone, ArrowRight, ArrowLeft } from 'lucide-react';

import PageWrapper from '../../components/PageWrapper';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useBooking } from '../../context/BookingContext';
import { supabase } from '../../lib/supabase';

const _now = new Date();
const TODAY = [
  _now.getFullYear(),
  String(_now.getMonth() + 1).padStart(2, '0'),
  String(_now.getDate()).padStart(2, '0')
].join('-');

const _max = new Date(_now);
_max.setFullYear(_max.getFullYear() + 1);
const MAX_DATE = [
  _max.getFullYear(),
  String(_max.getMonth() + 1).padStart(2, '0'),
  String(_max.getDate()).padStart(2, '0')
].join('-');

const OPEN_TIME  = '11:00';
const CLOSE_TIME = '23:00';

const timeSlots = [
  "12:00", "13:30", "15:00", "17:00", "19:00", "21:00"
];

export default function TableReservation() {
  const navigate = useNavigate();
  const { bookingData, setBookingData } = useBooking();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: 1,
    date: '',
    time: ''
  });

  const [errors, setErrors] = useState({});
  const [availableTables, setAvailableTables] = useState(null);

  useEffect(() => {
    const checkAvailability = async () => {
      if (formData.date && formData.time && formData.time >= OPEN_TIME && formData.time <= CLOSE_TIME) {
        try {
          const { count, error } = await supabase
            .from('table_bookings')
            .select('*', { count: 'exact', head: true })
            .eq('date', formData.date)
            .eq('time', formData.time);
            
          if (error) {
            console.error('Error fetching availability:', error);
            setAvailableTables(null);
          } else {
            const booked = count || 0;
            setAvailableTables(70 - booked);
          }
        } catch (err) {
          console.error('Unexpected error checking availability:', err);
          setAvailableTables(null);
        }
      } else {
        setAvailableTables(null);
      }
    };

    checkAvailability();
  }, [formData.date, formData.time]);

  const handleNameChange = (e) => {
    const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setFormData(prev => ({ ...prev, name: filtered }));
    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
  };

  const handlePhoneChange = (e) => {
    const filtered = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, phone: filtered }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, date: val }));

    if (val && val < TODAY) {
      setErrors(prev => ({ ...prev, date: 'Booking date cannot be in the past.' }));
    } else if (val && val > MAX_DATE) {
      setErrors(prev => ({ ...prev, date: `Bookings can only be made up to 1 year in advance.` }));
    } else {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };

  const handleGuestChange = (e) => {
    const val = parseInt(e.target.value);
    const clamped = isNaN(val) || val < 1 ? 1 : val;
    setFormData(prev => ({ ...prev, guests: clamped }));
    if (errors.guests) setErrors(prev => ({ ...prev, guests: '' }));
  };

  const handleGuestBlur = () => {
    if (formData.guests < 1) {
      setFormData(prev => ({ ...prev, guests: 1 }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const nameVal = formData.name.trim();

    if (!nameVal) {
      newErrors.name = 'Full name is required.';
    } else if (nameVal.length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required.';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Phone must be exactly 10 digits.';
    }

    if (!formData.guests || formData.guests < 1) {
      newErrors.guests = 'At least 1 guest is required.';
    } else if (formData.guests > 20) {
      newErrors.guests = 'Maximum 20 guests for a table booking. For larger groups, use Party Hall.';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date.';
    } else if (formData.date < TODAY) {
      newErrors.date = 'Booking date cannot be in the past.';
    }

    if (!formData.time) {
      newErrors.time = 'Please select a time.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (availableTables !== null && availableTables <= 0) {
      alert('No tables available for this time');
      return;
    }

    setBookingData({
      ...bookingData,
      type: 'table',
      name: formData.name.trim(),
      phone: formData.phone,
      people: formData.guests,
      date: formData.date,
      time: formData.time,
      total: formData.guests * 30
    });

    navigate('/table/payment');
  };

  const isSubmitDisabled =
    !formData.name.trim() ||
    !formData.phone ||
    formData.guests < 1 ||
    !formData.date ||
    !formData.time;

  return (
    <PageWrapper className="main-content" style={{ maxWidth: '800px' }}>
      <Button
        variant="secondary"
        className="mb-6"
        style={{ width: 'fit-content' }}
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={18} /> Back
      </Button>

      <Card>
        <Section title="Table Reservation Details" className="mb-6" />

        <div style={{ 
          background: 'rgba(5, 150, 105, 0.1)', 
          border: '1px solid var(--accent)', 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: '2rem' 
        }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Special Offer</h4>
          <p className="text-sm">
            You will receive a <strong>10% discount at the pub</strong>. Just show your booking confirmation!
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="desktop-grid" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <Input
              icon={User}
              label="Full Name"
              name="name"
              placeholder="e.g. Ravi Kumar"
              maxLength={50}
              value={formData.name}
              onChange={handleNameChange}
              error={errors.name}
              className="mb-0"
            />
            <Input
              icon={Phone}
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="10-digit number"
              maxLength={10}
              inputMode="numeric"
              value={formData.phone}
              onChange={handlePhoneChange}
              error={errors.phone}
              className="mb-0"
            />
          </div>

          <Input
            icon={Users}
            label="Number of People"
            type="number"
            name="guests"
            min={1}
            value={formData.guests}
            onChange={handleGuestChange}
            onBlur={handleGuestBlur}
            error={errors.guests}
          />
          <p className="text-secondary mb-6" style={{ fontSize: '0.8rem', marginTop: '-0.5rem' }}>
            ₹30 per head booking fee
          </p>

          <div className="desktop-grid" style={{ gap: '1rem', marginBottom: '2rem' }}>
            <Input
              icon={Calendar}
              label="Date"
              type="date"
              name="date"
              min={TODAY}
              max={MAX_DATE}
              value={formData.date}
              onChange={handleDateChange}
              error={errors.date}
              className="mb-0"
            />
            <div className="form-group mb-0">
              <label className="form-label">Time <span className="text-xs text-secondary">(11 AM – 11 PM)</span></label>
              <div style={{ position: 'relative' }}>
                <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <select
                  name="time"
                  className="form-select"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.time}
                  onChange={handleInputChange}
                >
                  <option value="">Select Time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              {errors.time && <p className="error-message">⚠ {errors.time}</p>}
              
              {availableTables !== null && (
                <div className="mt-2 text-sm">
                  {availableTables > 0 ? (
                    <span style={{ color: '#10b981', fontWeight: '600' }}>Available Tables: {availableTables}</span>
                  ) : (
                    <span className="text-error font-bold">No tables available</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitDisabled}>
            Continue to Payment <ArrowRight size={18} />
          </Button>
        </form>
      </Card>
    </PageWrapper>
  );
}
