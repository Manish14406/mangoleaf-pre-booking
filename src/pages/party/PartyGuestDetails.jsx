import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Calendar, Users, User, Phone, ArrowRight, ArrowLeft } from 'lucide-react';

import PageWrapper from '../../components/PageWrapper';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useBooking } from '../../context/BookingContext';

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

const SESSION_SLOTS = [
  { value: 'morning', label: 'Morning Session (12:00 PM - 3:00 PM)' },
  { value: 'night', label: 'Night Session (7:00 PM - 11:00 PM)' }
];

const MIN_GUESTS = 25;
const MAX_GUESTS = 200;

export default function PartyGuestDetails() {
  const navigate = useNavigate();
  const { bookingData, setBookingData } = useBooking();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: MIN_GUESTS,
    date: '',
    time: ''
  });

  const [errors, setErrors] = useState({});

  if (!bookingData || !bookingData.eventType) {
    return <Navigate to="/party" />;
  }

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

  const handleGuestChange = (e) => {
    const val = parseInt(e.target.value);
    const clamped = isNaN(val) || val < MIN_GUESTS
      ? MIN_GUESTS
      : val > MAX_GUESTS
        ? MAX_GUESTS
        : val;
    setFormData(prev => ({ ...prev, guests: clamped }));
    if (errors.guests) setErrors(prev => ({ ...prev, guests: '' }));
  };

  const handleGuestBlur = () => {
    if (formData.guests < MIN_GUESTS) {
      setFormData(prev => ({ ...prev, guests: MIN_GUESTS }));
    } else if (formData.guests > MAX_GUESTS) {
      setFormData(prev => ({ ...prev, guests: MAX_GUESTS }));
    }
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

  const handleSessionChange = (e) => {
    setFormData(prev => ({ ...prev, time: e.target.value }));
    if (errors.time) setErrors(prev => ({ ...prev, time: '' }));
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

    if (!formData.guests || formData.guests < MIN_GUESTS) {
      newErrors.guests = `Minimum ${MIN_GUESTS} guests required.`;
    } else if (formData.guests > MAX_GUESTS) {
      newErrors.guests = `Maximum capacity is ${MAX_GUESTS} guests.`;
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date.';
    } else if (formData.date < TODAY) {
      newErrors.date = 'Booking date cannot be in the past.';
    } else if (formData.date > MAX_DATE) {
      newErrors.date = `Bookings can only be made up 1 year in advance.`;
    }

    if (!formData.time) {
      newErrors.time = 'Please select a session slot.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setBookingData({
      ...bookingData,
      name: formData.name.trim(),
      phone: formData.phone,
      people: formData.guests,
      date: formData.date,
      time: formData.time
    });

    navigate('/party/menu-type');
  };

  const isSubmitDisabled =
    !formData.name.trim() ||
    !formData.phone ||
    formData.guests < MIN_GUESTS ||
    formData.guests > MAX_GUESTS ||
    !formData.date ||
    !formData.time;

  return (
    <PageWrapper className="main-content">
      <div className="progress-container">
        <div className="progress-line"></div>
        <div className="progress-step completed">1</div>
        <div className="progress-step active">2</div>
        <div className="progress-step">3</div>
        <div className="progress-step">4</div>
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
        <Section 
          title="Guest Details" 
          subtitle={<span className="text-gradient">{bookingData.eventType}</span>}
          className="mb-6"
        />

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
              pattern="[0-9]*"
              value={formData.phone}
              onChange={handlePhoneChange}
              error={errors.phone}
              className="mb-0"
            />
          </div>

          <Input
            icon={Users}
            label="Number of Guests"
            type="number"
            name="guests"
            min={MIN_GUESTS}
            max={MAX_GUESTS}
            value={formData.guests}
            onChange={handleGuestChange}
            onBlur={handleGuestBlur}
            error={errors.guests}
          />
          <p className="text-secondary mb-6" style={{ fontSize: '0.8rem', marginTop: '-0.5rem' }}>
            Minimum: {MIN_GUESTS} | Maximum: {MAX_GUESTS} people
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
              <label className="form-label">Session Slot</label>
              <select
                name="time"
                className="form-select"
                value={formData.time}
                onChange={handleSessionChange}
              >
                <option value="">-- Select a session --</option>
                {SESSION_SLOTS.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
              {errors.time && <span className="error-message">⚠ {errors.time}</span>}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitDisabled}>
            Select Menu <ArrowRight size={18} />
          </Button>
        </form>
      </Card>
    </PageWrapper>
  );
}
