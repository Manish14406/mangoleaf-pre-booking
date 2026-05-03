// ─────────────────────────────────────────────
// React hooks
// ─────────────────────────────────────────────
import { useState } from 'react';

// Navigation
import { useNavigate, Navigate } from 'react-router-dom';

// Icons
import { Calendar, Users, User, Phone, ArrowRight, ArrowLeft } from 'lucide-react';

// Layout wrapper (Framer Motion page transition)
import PageWrapper from '../../components/PageWrapper';

// Global booking context
import { useBooking } from '../../context/BookingContext';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

// Today's date in LOCAL timezone (not UTC) as YYYY-MM-DD
// Used as `min` on the date input and in validateForm
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

// Party hall session slots
// Each session is an optgroup with fixed 30-min intervals.
// Value is stored as HH:MM (24-hour) for consistency.
const SESSION_SLOTS = [
  {
    label: '🌤 Afternoon Session (12:30 PM – 3:00 PM)',
    slots: [
      { value: '12:30', label: '12:30 PM' },
      { value: '13:00', label: '1:00 PM'  },
      { value: '13:30', label: '1:30 PM'  },
      { value: '14:00', label: '2:00 PM'  },
      { value: '14:30', label: '2:30 PM'  },
      { value: '15:00', label: '3:00 PM'  },
    ]
  },
  {
    label: '🌙 Night Session (7:00 PM – 10:30 PM)',
    slots: [
      { value: '19:00', label: '7:00 PM'  },
      { value: '19:30', label: '7:30 PM'  },
      { value: '20:00', label: '8:00 PM'  },
      { value: '20:30', label: '8:30 PM'  },
      { value: '21:00', label: '9:00 PM'  },
      { value: '21:30', label: '9:30 PM'  },
      { value: '22:00', label: '10:00 PM' },
      { value: '22:30', label: '10:30 PM' },
    ]
  }
];

// Party hall guest limits
const MIN_GUESTS = 25;
const MAX_GUESTS = 200;

export default function PartyGuestDetails() {
  const navigate = useNavigate();

  // ─────────────────────────────────────────────
  // Global booking context
  // ─────────────────────────────────────────────
  const { bookingData, setBookingData } = useBooking();

  // ─────────────────────────────────────────────
  // Local form state
  // guests defaults to MIN_GUESTS (party minimum)
  // ─────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: MIN_GUESTS,
    date: '',
    time: ''
  });

  // ─────────────────────────────────────────────
  // Validation errors — one key per field
  // ─────────────────────────────────────────────
  const [errors, setErrors] = useState({});

  // ─────────────────────────────────────────────
  // Guard: if user lands here without selecting
  // an event type first, redirect to /party
  // ─────────────────────────────────────────────
  if (!bookingData || !bookingData.eventType) {
    return <Navigate to="/party" />;
  }

  // ─────────────────────────────────────────────
  // handleNameChange
  // Strips anything that is NOT a letter or space.
  // Digits and symbols are silently blocked.
  // ─────────────────────────────────────────────
  const handleNameChange = (e) => {
    const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setFormData(prev => ({ ...prev, name: filtered }));
    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
  };

  // ─────────────────────────────────────────────
  // handlePhoneChange
  // Strips everything except digits (0-9).
  // Letters, spaces, symbols cannot be typed.
  // ─────────────────────────────────────────────
  const handlePhoneChange = (e) => {
    const filtered = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, phone: filtered }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  // ─────────────────────────────────────────────
  // handleGuestChange
  // Immediately clamps value to MIN_GUESTS–MAX_GUESTS.
  // Prevents 0 or out-of-range values being stored.
  // ─────────────────────────────────────────────
  const handleGuestChange = (e) => {
    const val = parseInt(e.target.value);
    // If cleared / invalid, fall back to minimum
    const clamped = isNaN(val) || val < MIN_GUESTS
      ? MIN_GUESTS
      : val > MAX_GUESTS
        ? MAX_GUESTS
        : val;
    setFormData(prev => ({ ...prev, guests: clamped }));
    if (errors.guests) setErrors(prev => ({ ...prev, guests: '' }));
  };

  // Secondary safety net: snap back to range on blur
  // (handles edge cases like the browser's native spinner)
  const handleGuestBlur = () => {
    if (formData.guests < MIN_GUESTS) {
      setFormData(prev => ({ ...prev, guests: MIN_GUESTS }));
    } else if (formData.guests > MAX_GUESTS) {
      setFormData(prev => ({ ...prev, guests: MAX_GUESTS }));
    }
  };

  // ─────────────────────────────────────────────
  // handleDateChange
  // Validates the picked/typed date immediately
  // so past-year errors show without waiting for submit.
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
  // handleSessionChange
  // Updates the selected time slot from the dropdown.
  // Value is HH:MM (24-hour) matching SESSION_SLOTS.
  // ─────────────────────────────────────────────
  const handleSessionChange = (e) => {
    setFormData(prev => ({ ...prev, time: e.target.value }));
    if (errors.time) setErrors(prev => ({ ...prev, time: '' }));
  };

  // ─────────────────────────────────────────────
  // validateForm()
  //
  // Full validation on every field.
  // Populates errors state and returns true/false.
  // ─────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    // ── Rule 1: Name ──────────────────────────────
    // Required, letters and spaces only, min 3 chars
    const nameVal = formData.name.trim();
    if (!nameVal) {
      newErrors.name = 'Full name is required.';
    } else if (nameVal.length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    } else if (!/^[a-zA-Z\s]+$/.test(nameVal)) {
      // Safety net for any edge case past the handler
      newErrors.name = 'Name must contain only letters and spaces.';
    }

    // ── Rule 2: Phone ─────────────────────────────
    // Required, exactly 10 digits
    // handlePhoneChange already strips non-digits,
    // so formData.phone contains only digits
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required.';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Phone must be exactly 10 digits.';
    }

    // ── Rule 3: Guests ────────────────────────────
    // Party hall: 25 minimum, 200 maximum
    if (!formData.guests || formData.guests < MIN_GUESTS) {
      newErrors.guests = `Minimum ${MIN_GUESTS} guests required for party hall.`;
    } else if (formData.guests > MAX_GUESTS) {
      newErrors.guests = `Maximum capacity is ${MAX_GUESTS} guests.`;
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

    // ── Rule 5: Session / Time ────────────────────────
    // Must select a session slot from the dropdown
    if (!formData.time) {
      newErrors.time = 'Please select a session slot.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─────────────────────────────────────────────
  // handleSubmit
  // 1. Prevent default
  // 2. Run full validation — abort if invalid
  // 3. Save to global context (no route state)
  // 4. Navigate to menu type selection
  // ─────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    setBookingData({
      ...bookingData,           // keep eventType and other existing data
      name: formData.name.trim(),
      phone: formData.phone,   // already pure digits — no .trim() needed
      people: formData.guests,
      date: formData.date,
      time: formData.time
    });

    navigate('/party/menu-type');
  };

  // ─────────────────────────────────────────────
  // isSubmitDisabled
  // Fast empty-field check only.
  // Range errors are shown by validateForm() on submit,
  // not silently via a grey button.
  // ─────────────────────────────────────────────
  const isSubmitDisabled =
    !formData.name.trim() ||
    !formData.phone ||
    formData.guests < MIN_GUESTS ||
    formData.guests > MAX_GUESTS ||
    !formData.date ||
    !formData.time;

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <PageWrapper className="main-content" style={{ gridTemplateColumns: '1fr', maxWidth: '600px', margin: '0 auto' }}>

      {/* Back button */}
      <button
        className="btn-secondary"
        style={{ border: 'none', marginBottom: '1rem', display: 'inline-flex', padding: '0.5rem', width: 'fit-content' }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '2rem' }}>

        {/* Header — show the selected event type from context */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Guest Details</h2>
          <p className="text-gradient">{bookingData.eventType}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Row 1: Name + Phone ─────────────────────── */}
          <div className="grid-2col" style={{ marginBottom: '1.5rem' }}>

            {/* Full Name — letters and spaces only */}
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
                  onChange={handleNameChange}   // strips digits & symbols
                  placeholder="e.g. Ravi Kumar"
                  maxLength={50}
                />
              </div>
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>

            {/* Phone — digits only, exactly 10 */}
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
                  onChange={handlePhoneChange}   // strips all non-digits
                  placeholder="10-digit number"
                  maxLength={10}
                  inputMode="numeric"            // numeric keyboard on mobile
                  pattern="[0-9]*"               // additional browser-level hint
                />
              </div>
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>

          </div>

          {/* ── Number of Guests ────────────────────────── */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Number of Guests</label>
            <div style={{ position: 'relative' }}>
              <Users size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
              <input
                type="number"
                name="guests"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                min={MIN_GUESTS}   // browser spinner blocked below 25
                max={MAX_GUESTS}   // browser spinner blocked above 200
                value={formData.guests}
                onChange={handleGuestChange}   // clamps immediately
                onBlur={handleGuestBlur}       // secondary clamp on blur
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Minimum: {MIN_GUESTS} | Maximum: {MAX_GUESTS} people
            </p>
            {errors.guests && <p className="error-message">{errors.guests}</p>}
          </div>

          {/* ── Date + Time ─────────────────────────────── */}
          <div className="grid-2col" style={{ marginBottom: '2rem' }}>

            {/* Date — past dates blocked in picker and on change */}
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
                  onChange={handleDateChange}   // validates past/future dates immediately
                  min={TODAY}                   // browser blocks past dates in picker
                  max={MAX_DATE}                // browser blocks dates beyond 1 year ahead
                />
              </div>
              {errors.date && <p className="error-message">{errors.date}</p>}
            </div>

            {/* Session Slot — Afternoon or Night */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Session Slot</label>
              <div style={{ position: 'relative' }}>
                <select
                  name="time"
                  className="form-select"
                  style={{ paddingLeft: '1rem' }}
                  value={formData.time}
                  onChange={handleSessionChange}
                >
                  {/* Default empty option */}
                  <option value="">-- Select a session --</option>

                  {/* Render each session as an optgroup */}
                  {SESSION_SLOTS.map((session) => (
                    <optgroup key={session.label} label={session.label}>
                      {session.slots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              {errors.time && <p className="error-message">{errors.time}</p>}
            </div>

          </div>

          {/* ── Submit Button ────────────────────────────── */}
          {/*
            Disabled only when required fields are visibly empty or out of range.
            Full validateForm() still fires on submit for clear error messages.
          */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitDisabled}
          >
            Select Menu <ArrowRight size={20} />
          </button>

        </form>
      </div>

    </PageWrapper>
  );
}
