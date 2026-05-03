// ─────────────────────────────────────────────
// Import React hooks
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';

// Navigation
import { useNavigate } from 'react-router-dom';

// Icons
import { Calendar, Clock, Users, User, Phone, ArrowRight, ArrowLeft } from 'lucide-react';

// Layout wrapper (Framer Motion page transition)
import PageWrapper from '../../components/PageWrapper';

// Global booking context
import { useBooking } from '../../context/BookingContext';

// Supabase client
import { supabase } from '../../lib/supabase';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

// Today's date in YYYY-MM-DD format — calculated in LOCAL timezone
// (toISOString() returns UTC which can be the wrong calendar date for
// users in UTC+5:30 after ~6:30 PM IST, so we build the string manually)
const _now = new Date();
const TODAY = [
  _now.getFullYear(),
  String(_now.getMonth() + 1).padStart(2, '0'),
  String(_now.getDate()).padStart(2, '0')
].join('-');

// Maximum bookable date = exactly 1 year from today
// Prevents users typing years like 2099 or 20000
const _max = new Date(_now);
_max.setFullYear(_max.getFullYear() + 1);
const MAX_DATE = [
  _max.getFullYear(),
  String(_max.getMonth() + 1).padStart(2, '0'),
  String(_max.getDate()).padStart(2, '0')
].join('-');

// Restaurant open/close times (24-hour HH:MM strings)
// Applied as `min` / `max` on the time input AND validated in validateForm()
const OPEN_TIME  = '11:00';   // 11:00 AM
const CLOSE_TIME = '23:00';   // 11:00 PM (last booking slot)

// fixed time slots dropdown
const timeSlots = [
  "12:00",
  "13:30",
  "15:00",
  "17:00",
  "19:00",
  "21:00"
];

export default function TableReservation() {
  const navigate = useNavigate();

  // ─────────────────────────────────────────────
  // Global booking context
  // ─────────────────────────────────────────────
  const { bookingData, setBookingData } = useBooking();

  // ─────────────────────────────────────────────
  // Local form state (controls what user types)
  // ─────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: 1,
    date: '',
    time: ''
  });

  // ─────────────────────────────────────────────
  // Validation errors state
  // Each key maps to an error message string,
  // or is absent if that field has no error.
  // ─────────────────────────────────────────────
  const [errors, setErrors] = useState({});

  // ─────────────────────────────────────────────
  // Table Availability state
  // ─────────────────────────────────────────────
  const [availableTables, setAvailableTables] = useState(null);

  // ─────────────────────────────────────────────
  // Check availability from Supabase
  // ─────────────────────────────────────────────
  useEffect(() => {
    const checkAvailability = async () => {
      // Trigger when user selects date and time
      if (formData.date && formData.time && formData.time >= OPEN_TIME && formData.time <= CLOSE_TIME) {
        try {
          // Query table_bookings, filter by selected date and time
          const { count, error } = await supabase
            .from('table_bookings')
            .select('*', { count: 'exact', head: true })
            .eq('date', formData.date)
            .eq('time', formData.time);
            
          if (error) {
            console.error('Error fetching availability:', error);
            setAvailableTables(null);
          } else {
            // Total tables = 70
            const booked = count || 0;
            // available = 70 - booked
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

  // ─────────────────────────────────────────────
  // handleNameChange
  // Only allows letters (A-Z, a-z) and spaces.
  // Silently ignores digits and special characters
  // so they never appear in the field at all.
  // ─────────────────────────────────────────────
  const handleNameChange = (e) => {
    // Strip anything that is not a letter or a space
    const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setFormData(prev => ({ ...prev, name: filtered }));
    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
  };

  // ─────────────────────────────────────────────
  // handlePhoneChange
  // Only allows digit characters (0-9).
  // Silently strips any non-digit so letters,
  // symbols, etc. can never appear in the field.
  // ─────────────────────────────────────────────
  const handlePhoneChange = (e) => {
    const filtered = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, phone: filtered }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  // ─────────────────────────────────────────────
  // handleInputChange
  // Generic handler for date and time inputs
  // ─────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ─────────────────────────────────────────────
  // handleDateChange
  // Validates the date immediately on every change
  // so the user gets instant feedback if they type
  // a past date manually (e.g. year 2020).
  // ─────────────────────────────────────────────
  const handleDateChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, date: val }));

    // Validate immediately on every keystroke / picker change
    if (val && val < TODAY) {
      setErrors(prev => ({ ...prev, date: 'Booking date cannot be in the past.' }));
    } else if (val && val > MAX_DATE) {
      // Blocks years far in the future (e.g. 2099, 20000)
      setErrors(prev => ({ ...prev, date: `Bookings can only be made up to 1 year in advance (by ${MAX_DATE}).` }));
    } else {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };

  // ─────────────────────────────────────────────
  // Handle guest number input change
  // Clamps to minimum 1 immediately so the field
  // can never store 0 or a negative number.
  // ─────────────────────────────────────────────
  const handleGuestChange = (e) => {
    const val = parseInt(e.target.value);
    // If NaN (field cleared) default to 1; also enforce minimum 1
    const clamped = isNaN(val) || val < 1 ? 1 : val;
    setFormData(prev => ({ ...prev, guests: clamped }));
    if (errors.guests) setErrors(prev => ({ ...prev, guests: '' }));
  };

  // ─────────────────────────────────────────────
  // Prevent guests going below 1 on blur
  // (secondary safety net — handleGuestChange
  // already prevents it, but blur handles edge cases
  // like the browser's native spinner being dragged down)
  // ─────────────────────────────────────────────
  const handleGuestBlur = () => {
    if (formData.guests < 1) {
      setFormData(prev => ({ ...prev, guests: 1 }));
    }
  };

  // ─────────────────────────────────────────────
  // validateForm()
  //
  // Checks every field, populates the errors
  // object with human-readable messages, and
  // returns true only if ALL fields are valid.
  // ─────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    // ── Rule 1: Name ──────────────────────────────
    // Required, min 3 chars, letters and spaces only
    const nameVal = formData.name.trim();
    if (!nameVal) {
      newErrors.name = 'Full name is required.';
    } else if (nameVal.length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    } else if (!/^[a-zA-Z\s]+$/.test(nameVal)) {
      // Catches any edge case that slipped past handleNameChange
      newErrors.name = 'Name must contain only letters and spaces.';
    }

    // ── Rule 2: Phone ─────────────────────────────
    // Required, exactly 10 digits
    // handlePhoneChange already strips non-digits, so
    // formData.phone itself only contains digits
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required.';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Phone must be exactly 10 digits.';
    }

    // ── Rule 3: Guests ────────────────────────────
    // Must be at least 1 and no more than 20 for a table booking
    if (!formData.guests || formData.guests < 1) {
      newErrors.guests = 'At least 1 guest is required.';
    } else if (formData.guests > 20) {
      newErrors.guests = 'Maximum 20 guests for a table booking. For larger groups, use Party Hall.';
    }

    // ── Rule 4: Date ──────────────────────────────
    // Required, not in the past, not beyond 1 year ahead
    if (!formData.date) {
      newErrors.date = 'Please select a date.';
    } else if (formData.date < TODAY) {
      newErrors.date = 'Booking date cannot be in the past.';
    } else if (formData.date > MAX_DATE) {
      newErrors.date = `Bookings can only be made up to 1 year in advance (by ${MAX_DATE}).`;
    }

    // ── Rule 5: Time ──────────────────────────────
    // Required AND must be within restaurant hours
    if (!formData.time) {
      newErrors.time = 'Please select a time.';
    } else if (formData.time < OPEN_TIME) {
      newErrors.time = `Restaurant opens at ${OPEN_TIME} (11:00 AM).`;
    } else if (formData.time > CLOSE_TIME) {
      newErrors.time = `Last booking is at ${CLOSE_TIME} (11:00 PM).`;
    }

    // Push all errors into state so the UI re-renders
    setErrors(newErrors);

    // Return true only if zero errors were found
    return Object.keys(newErrors).length === 0;
  };

  // ─────────────────────────────────────────────
  // handleSubmit
  //
  // 1. Prevents default form behaviour
  // 2. Runs validation — stops if invalid
  // 3. Saves data to global context
  // 4. Navigates to the payment page
  // ─────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    // Step 1: Validate — abort if any field fails
    const isValid = validateForm();
    if (!isValid) return;

    // Block booking if no tables available
    if (availableTables !== null && availableTables <= 0) {
      alert('No tables available for this time');
      return;
    }

    // Step 2: Save all data into global context
    setBookingData({
      ...bookingData,           // keep any pre-existing context data
      type: 'table',            // booking type identifier
      name: formData.name.trim(),
      phone: formData.phone,
      people: formData.guests,
      date: formData.date,
      time: formData.time,
      total: formData.guests * 30   // ₹30 per head booking fee
    });

    // Step 3: Navigate without route state (context carries the data)
    navigate('/table/payment');
  };

  // isSubmitDisabled: fast empty-field check only.
  // Time/date RANGE checks are intentionally left to validateForm()
  // so the button stays enabled and shows the user a helpful error
  // message rather than silently staying grey.
  const isSubmitDisabled =
    !formData.name.trim() ||
    !formData.phone ||
    formData.guests < 1 ||
    !formData.date ||
    !formData.time;

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <PageWrapper className="main-content" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>

      {/* Back button — same style as before */}
      <button
        className="btn-secondary"
        style={{ border: 'none', marginBottom: '1rem', display: 'inline-flex', padding: '0.5rem', width: 'fit-content' }}
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back
      </button>

      <div className="glass-panel reservation-form">
        <h2 style={{ marginBottom: '1.5rem' }}>Table Reservation Details</h2>

        {/* Special offer banner */}
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--secondary)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>Special Offer</h4>
          <p style={{ fontSize: '0.9rem' }}>
            You will receive a <strong>10% discount at the pub</strong>. Just show your booking confirmation!
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Row 1: Name + Phone ─────────────────── */}
          <div className="grid-2col" style={{ marginBottom: '1.5rem' }}>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.name}
                  onChange={handleNameChange}   // letters & spaces only
                  placeholder="e.g. Ravi Kumar"
                  maxLength={50}
                />
              </div>
              {/* Inline error — only shown when errors.name is set */}
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.phone}
                  onChange={handlePhoneChange}   // digits only
                  placeholder="10-digit number"
                  maxLength={10}
                  inputMode="numeric"   // numeric keyboard on mobile
                />
              </div>
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>

          </div>

          {/* ── Row 2: Number of Guests ─────────────── */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Number of People</label>
            <div style={{ position: 'relative' }}>
              <Users size={18} style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
              <input
                type="number"
                name="guests"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                min={1}               // HTML attribute — blocks browser spinner below 1
                value={formData.guests}
                onChange={handleGuestChange}
                onBlur={handleGuestBlur}  // snap back to 1 if user clears the field
              />
            </div>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>₹30 per head booking fee</p>
            {errors.guests && <p className="error-message">{errors.guests}</p>}
          </div>

          {/* ── Row 3: Date + Time ──────────────────── */}
          <div className="grid-2col" style={{ marginBottom: '2rem' }}>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.date}
                  onChange={handleDateChange}   // validates past/future dates immediately
                  min={TODAY}                   // browser blocks past dates in picker
                  max={MAX_DATE}                // browser blocks dates beyond 1 year ahead
                />
              </div>
              {errors.date && <p className="error-message">{errors.date}</p>}
            </div>

            {/* Time — restaurant hours 11:00 AM to 11:00 PM */}
            <div className="form-group">
              <label className="form-label">Time <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(11 AM – 11 PM)</span></label>
              <div style={{ position: 'relative' }}>
                <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                {/* fixed time slots dropdown */}
                <select
                  name="time"
                  className="form-input"
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
              {errors.time && <p className="error-message">{errors.time}</p>}
              
              {/* Show Availability in UI */}
              {availableTables !== null && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                  {availableTables > 0 ? (
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                      Available Tables: {availableTables}
                    </span>
                  ) : (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>
                      No tables available for this time
                    </span>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* ── Submit Button ───────────────────────── */}
          {/*
            Disabled when any required field is visibly empty.
            Full validation (with error messages) still runs on submit
            in case the user somehow bypasses the disabled check.
          */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitDisabled}
          >
            Continue to Payment <ArrowRight size={20} />
          </button>

        </form>
      </div>

    </PageWrapper>
  );
}