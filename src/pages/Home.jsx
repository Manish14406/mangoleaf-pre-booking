import { useNavigate } from 'react-router-dom';
import { Utensils, Music, MapPin, Phone, Clock, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Section from '../components/Section';

// ── Gallery images: drop any file into public/gallery/ and add its name here
const GALLERY_IMAGES = [
  'frontpic.webp',
  '2.webp',
  '3.webp',
  '4.webp',
  '5.webp',
  '6.webp',
];

export default function Home() {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState(GALLERY_IMAGES);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const WHATSAPP_NUMBER = '919880703329';
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20make%20a%20reservation%20at%20Mango%20Leaf%20PUB%20%26%20Restaurant.`;

  return (
    <>
      {/* ───── Floating WhatsApp Button ───── */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
          <path d="M16 .8C7.6.8.8 7.6.8 16c0 2.7.7 5.3 2 7.6L.8 31.2l7.8-2c2.2 1.2 4.7 1.8 7.4 1.8 8.4 0 15.2-6.8 15.2-15.2S24.4.8 16 .8zm0 27.8c-2.4 0-4.7-.6-6.8-1.8l-.5-.3-4.6 1.2 1.2-4.5-.3-.5C3.7 20.6 3 18.4 3 16 3 9 9 3 16 3s13 6 13 13-6 13-13 13zm7.1-9.7c-.4-.2-2.3-1.1-2.6-1.2-.4-.1-.6-.2-.9.2s-1 1.2-1.3 1.5c-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.3-2.2-2.7-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.4-.6.1-.2 0-.4-.1-.6-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.3 0-.7.1-1 .4-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.2 2.8 4.3 6.8 6 .9.4 1.7.6 2.3.8 1 .3 1.9.3 2.6.2.8-.1 2.3-.9 2.7-1.8.3-.9.3-1.6.2-1.8-.1-.1-.3-.2-.7-.4z" />
        </svg>
        <span>WhatsApp Us</span>
      </a>

      {/* ───── Lightbox ───── */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
          <img src={lightboxImg} alt="Gallery" className="lightbox-img" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* ───── Hero ───── */}
      <div className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content animate-fade-in">
          <div className="hero-badge">Welcome to</div>
          <h1 className="hero-title">Mango Leaf</h1>
          <div className="hero-subtitle">PUB &amp; RESTAURANT</div>
          <p className="hero-tagline">Where Every Moment Tastes Extraordinary</p>
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={() => navigate('/table')}>
              <Utensils size={18} /> Reserve a Table
            </button>
            <button className="btn-hero-secondary" onClick={() => navigate('/party')}>
              <Music size={18} /> Book a Party
            </button>
          </div>
        </div>
        <a href="#booking" className="hero-scroll-hint">
          <ChevronDown size={22} />
          <span>Explore</span>
        </a>
      </div>

      {/* ───── Booking Cards ───── */}
      <div id="booking" className="landing-section">
        <div className="section-header">
          <div className="section-eyebrow">Make a Reservation</div>
          <h2 className="section-title">Book Your Experience</h2>
          <p className="section-subtitle">Choose the perfect setting for your occasion</p>
        </div>
        <div className="booking-grid">
          <button
            onClick={() => navigate('/table')}
            className="booking-card-btn"
          >
            <div className="booking-card">
              <div className="booking-card-icon" style={{ background: 'rgba(217,119,6,0.12)' }}>
                <Utensils size={40} color="var(--primary)" />
              </div>
              <h3>Table Booking</h3>
              <p>Book a table for dining and drinks. Perfect for intimate gatherings and small groups.</p>
              <div className="booking-card-cta">Reserve Now →</div>
            </div>
          </button>

          <button
            onClick={() => navigate('/party')}
            className="booking-card-btn"
          >
            <div className="booking-card">
              <div className="booking-card-icon" style={{ background: 'rgba(245,158,11,0.12)' }}>
                <Music size={40} color="var(--accent)" />
              </div>
              <h3>Party Hall Booking</h3>
              <p>Exclusive space for events and celebrations. Perfect for large gatherings of 25+ guests.</p>
              <div className="booking-card-cta">Plan Your Event →</div>
            </div>
          </button>
        </div>
      </div>

      {/* ───── About Section ───── */}
      <div id="about" className="about-section">
        <div className="about-grid">
          <div className="about-text">
            <div className="section-eyebrow">Our Story</div>
            <h2>A Place Where Nature Meets Flavour</h2>
            <p>
              Nestled amidst lush green surroundings on the Bagalur–Budigere Road, Mango Leaf PUB &amp; Restaurant is more than a dining destination — it's an experience. Breathe in the fresh air, listen to the rustle of leaves, and let the tranquil greenery melt away the day.
            </p>
            <p>
              Whether you're raising a toast with friends, celebrating a milestone, or simply unwinding over great food and craft cocktails, our warm, open-air ambience sets the perfect stage. Every corner of Mango Leaf has been thoughtfully designed to feel inviting, relaxed, and alive.
            </p>
            <div className="about-highlights">
              <div className="about-highlight-item">
                <div className="about-highlight-icon">🌿</div>
                <div className="about-highlight-label">Surrounded by Greenery</div>
              </div>
              <div className="about-highlight-item">
                <div className="about-highlight-icon">🍹</div>
                <div className="about-highlight-label">Craft Cocktails &amp; Drinks</div>
              </div>
              <div className="about-highlight-item">
                <div className="about-highlight-icon">🎉</div>
                <div className="about-highlight-label">Private Party Hall</div>
              </div>
              <div className="about-highlight-item">
                <div className="about-highlight-icon">🌅</div>
                <div className="about-highlight-label">Open-Air Ambience</div>
              </div>
            </div>
          </div>
          <div className="about-image-block">
            <img src="/gallery/frontpic.webp" alt="Mango Leaf ambience" />
            <div className="about-image-badge">Est. Manchapanahalli</div>
          </div>
        </div>
      </div>

      {/* ───── Gallery ───── */}
      <div id="gallery" className="landing-section landing-section-alt">
        <div className="section-header">
          <div className="section-eyebrow">Our Space &amp; Food</div>
          <h2 className="section-title">Gallery</h2>
          <p className="section-subtitle">A glimpse into the Mango Leaf experience</p>
        </div>

        {galleryImages.length === 0 ? (
          <div className="gallery-empty">
            <div className="gallery-empty-icon">🖼️</div>
            <p>Gallery photos coming soon!</p>
            <span>Drop your photos into <code>public/gallery/</code> and list them in Home.jsx</span>
          </div>
        ) : (
          <div className="gallery-grid">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                className="gallery-item"
                onClick={() => setLightboxImg(`/gallery/${img}`)}
                aria-label={`View image ${i + 1}`}
              >
                <img src={`/gallery/${img}`} alt={`Gallery ${i + 1}`} loading="lazy" />
                <div className="gallery-item-overlay">
                  <span>View</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ───── Location & Contact ───── */}
      <div id="contact" className="landing-section">
        <div className="section-header">
          <div className="section-eyebrow">Find Us</div>
          <h2 className="section-title">Visit Us</h2>
          <p className="section-subtitle">We'd love to host you</p>
        </div>

        <div className="contact-grid">
          {/* Map Embed */}
          <div className="map-container">
            <iframe
              title="Mango Leaf Location"
              src="https://maps.google.com/maps?q=Manchappanahalli+Gate,+Khata+No+1924/2024,+Bagalur+to+Budigere+Road,+near+Budigere+By+Pass,+Manchapanahalli,+Karnataka+562165&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Contact Info */}
          <div className="contact-info-panel">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <MapPin size={22} color="var(--primary)" />
              </div>
              <div>
                <div className="contact-info-label">Address</div>
                <div className="contact-info-text">
                  Manchappanahalli Gate, Khata No 1924/2024,<br />
                  Bagalur to Budigere Road,<br />
                  Near Budigere By Pass,<br />
                  Manchapanahalli, Karnataka 562165
                </div>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Phone size={22} color="var(--primary)" />
              </div>
              <div>
                <div className="contact-info-label">Phone / WhatsApp</div>
                <a href={`tel:+919880703329`} className="contact-info-text contact-info-link">
                  +91 98807 03329
                </a>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Clock size={22} color="var(--primary)" />
              </div>
              <div>
                <div className="contact-info-label">Hours</div>
                <div className="contact-info-text">
                  Mon – Sun: 11:00 AM – 11:00 PM
                </div>
              </div>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              <svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor">
                <path d="M16 .8C7.6.8.8 7.6.8 16c0 2.7.7 5.3 2 7.6L.8 31.2l7.8-2c2.2 1.2 4.7 1.8 7.4 1.8 8.4 0 15.2-6.8 15.2-15.2S24.4.8 16 .8zm0 27.8c-2.4 0-4.7-.6-6.8-1.8l-.5-.3-4.6 1.2 1.2-4.5-.3-.5C3.7 20.6 3 18.4 3 16 3 9 9 3 16 3s13 6 13 13-6 13-13 13zm7.1-9.7c-.4-.2-2.3-1.1-2.6-1.2-.4-.1-.6-.2-.9.2s-1 1.2-1.3 1.5c-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.3-2.2-2.7-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.4-.6.1-.2 0-.4-.1-.6-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.3 0-.7.1-1 .4-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.2 2.8 4.3 6.8 6 .9.4 1.7.6 2.3.8 1 .3 1.9.3 2.6.2.8-.1 2.3-.9 2.7-1.8.3-.9.3-1.6.2-1.8-.1-.1-.3-.2-.7-.4z" />
              </svg>
              Chat on WhatsApp
            </a>

            <a
              href={`https://maps.google.com/maps?q=Manchappanahalli+Gate,+Khata+No+1924/2024,+Bagalur+to+Budigere+Road,+near+Budigere+By+Pass,+Manchapanahalli,+Karnataka+562165`}
              target="_blank"
              rel="noopener noreferrer"
              className="directions-btn"
            >
              <MapPin size={18} />
              Get Directions
            </a>
          </div>
        </div>
      </div>

      {/* ───── Footer ───── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">🥭 Mango Leaf</span>
            <span className="footer-tagline">PUB &amp; RESTAURANT</span>
          </div>
          <div className="footer-social">
            <a
              href="https://www.instagram.com/mangoleafrestaurant_"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-insta-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
              @mangoleafrestaurant_
            </a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Mango Leaf PUB &amp; Restaurant. All rights reserved.</p>
          <p className="footer-address">Manchappanahalli Gate, Bagalur - Budigere Road, Karnataka 562165</p>
        </div>
      </footer>
    </>
  );
}
