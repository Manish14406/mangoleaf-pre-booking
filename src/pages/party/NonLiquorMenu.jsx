// ✅ Reads from BookingContext — no location.state dependency
import { useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';
import { useBooking } from '../../context/BookingContext';

const MENU_ITEMS = [
  { category: "Starters (Veg)", items: ["Paneer Tikka", "Crispy Corn", "Gobi Manchurian", "Cheese Balls", "Veg Spring Rolls", "Honey Chilli Potato"] },
  { category: "Starters (Non-Veg)", items: ["Chicken Tikka", "Chilli Chicken", "Fish Fingers", "Mutton Seekh Kebab", "Prawn Tempura", "Chicken Wings"] },
  { category: "Main Course", items: ["Chicken Biryani", "Mutton Rogan Josh", "Paneer Butter Masala", "Dal Makhani", "Veg Pulao", "Butter Naan & Roti"] },
  { category: "International", items: ["Penne Alfredo Pasta", "Spaghetti Bolognese", "Hakka Noodles", "Veg Fried Rice", "Margherita Pizza"] },
  { category: "Desserts", items: ["Vanilla Ice Cream", "Hot Chocolate Brownie", "Gulab Jamun", "Rasmalai", "Cheesecake"] },
  { category: "Beverages", items: ["Virgin Mojito", "Blue Lagoon Mocktail", "Fresh Lime Soda", "Mango Juice", "Cold Coffee", "Diet Coke"] }
];

export default function NonLiquorMenu() {
  const navigate = useNavigate();
  const { bookingData } = useBooking();

  // Guard: must have arrived via correct menu selection
  if (!bookingData || !bookingData.menuType || bookingData.menuType !== 'non-liquor') {
    return <Navigate to="/party" />;
  }

  const handleContinue = () => {
    // Context already has all data — navigate directly
    navigate('/party/payment');
  };

  return (
    <PageWrapper className="main-content" style={{ gridTemplateColumns: '1fr', maxWidth: '1000px', margin: '0 auto' }}>
      <button
        className="btn-secondary"
        style={{ border: 'none', marginBottom: '1rem', display: 'inline-flex', padding: '0.5rem', width: 'fit-content' }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Exquisite Dining Menu</h2>
          <p style={{ color: 'var(--text-muted)' }}>A rich spread of food and beverages for your party</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {MENU_ITEMS.map((section, idx) => (
            <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ color: 'var(--secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                {section.category}
              </h3>
              <ul style={{ listStyle: 'none' }}>
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    <Check size={14} style={{ color: 'var(--primary)', marginRight: '0.5rem', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            * This is a sample menu. Final items are subject to availability.
          </div>
          <button className="btn-primary" style={{ width: 'auto', marginTop: 0 }} onClick={handleContinue}>
            Confirm Menu &amp; Proceed <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
