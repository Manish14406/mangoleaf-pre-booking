import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Minus, ShoppingBag } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Button from '../../components/Button';
import { useBooking } from '../../context/BookingContext';

const menuData = [
  {
    category: "Soups",
    items: [
      { id: 1, name: "Veg Manchow Soup", price: 119 },
      { id: 2, name: "Cream Of Tomato Soup", price: 99 },
      { id: 3, name: "Chicken Manchow Soup", price: 149 }
    ]
  },
  {
    category: "Veg Starters",
    items: [
      { id: 10, name: "Baby Corn Chilli", price: 209 },
      { id: 11, name: "Paneer Chilli", price: 269 },
      { id: 12, name: "Gobi Manchurian", price: 199 }
    ]
  },
  {
    category: "Non-Veg Starters",
    items: [
      { id: 15, name: "Chicken Chilli", price: 289 },
      { id: 16, name: "Chicken 65", price: 279 },
      { id: 17, name: "Mutton Pepper Dry", price: 349 }
    ]
  },
  {
    category: "Indian Gravy",
    items: [
      { id: 20, name: "Paneer Butter Masala", price: 239 },
      { id: 21, name: "Dal Fry", price: 185 },
      { id: 22, name: "Chicken Tikka Masala", price: 319 }
    ]
  },
  {
    category: "Chinese",
    items: [
      { id: 25, name: "Veg Hakka Noodles", price: 179 },
      { id: 26, name: "Chicken Schezwan Noodles", price: 229 }
    ]
  },
  {
    category: "Rice & Noodles",
    items: [
      { id: 30, name: "Veg Fried Rice", price: 189 },
      { id: 31, name: "Chicken Fried Rice", price: 259 }
    ]
  },
  {
    category: "Breads",
    items: [
      { id: 40, name: "Butter Naan", price: 45 },
      { id: 41, name: "Tandoori Roti", price: 30 },
      { id: 42, name: "Garlic Naan", price: 55 }
    ]
  },
  {
    category: "Desserts",
    items: [
      { id: 50, name: "Gulab Jamun (2 pcs)", price: 79 },
      { id: 51, name: "Vanilla Ice Cream", price: 99 },
      { id: 52, name: "Sizzling Brownie", price: 189 }
    ]
  },
  {
    category: "Beverages",
    items: [
      { id: 60, name: "Fresh Lime Soda", price: 89 },
      { id: 61, name: "Virgin Mojito", price: 129 },
      { id: 62, name: "Cold Coffee", price: 149 }
    ]
  }
];

export default function PartyMenu() {
  const navigate = useNavigate();
  const { menuType } = useParams();
  const { bookingData, setBookingData } = useBooking();
  
  const [activeCategory, setActiveCategory] = useState(menuData[0].category);
  const [selectedItems, setSelectedItems] = useState([]);

  if (!bookingData || !bookingData.eventType || !bookingData.name) {
    return <Navigate to="/party" />;
  }

  useEffect(() => {
    if (bookingData.selectedItems && bookingData.selectedItems.length > 0) {
      setSelectedItems(bookingData.selectedItems);
    }
  }, [bookingData.selectedItems]);

  const updateQuantity = (item, delta) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          return prev.filter(i => i.id !== item.id);
        }
        return prev.map(i => i.id === item.id ? { ...i, quantity: newQuantity } : i);
      } else if (delta > 0) {
        return [...prev, { id: item.id, name: item.name, price: item.price, quantity: delta }];
      }
      return prev;
    });
  };

  const getQuantity = (itemId) => {
    const item = selectedItems.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  const totals = useMemo(() => {
    const baseTotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const isLiquor = menuType === 'liquor' || bookingData.menuType === 'liquor';
    const liquorCharge = isLiquor ? baseTotal * 0.10 : 0;
    const finalTotal = Math.round(baseTotal + liquorCharge);
    const advanceAmount = Math.round(finalTotal * 0.5);
    
    return {
      baseTotal,
      liquorCharge,
      finalTotal,
      advanceAmount,
      isLiquor
    };
  }, [selectedItems, menuType, bookingData.menuType]);

  const totalItemCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleContinue = () => {
    setBookingData(prev => ({
      ...prev,
      selectedItems,
      total: totals.finalTotal,
      advance: totals.advanceAmount,
      baseTotal: totals.baseTotal,
      liquorCharge: totals.liquorCharge
    }));
    navigate('/party/payment');
  };

  return (
    <PageWrapper className="app-container" style={{ paddingBottom: '120px' }}>
      <div className="progress-container mb-8">
        <div className="progress-line"></div>
        <div className="progress-step completed">1</div>
        <div className="progress-step completed">2</div>
        <div className="progress-step completed">3</div>
        <div className="progress-step active">4</div>
      </div>

      <div className="flex-between mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          style={{ width: 'fit-content' }}
        >
          <ArrowLeft size={18} /> Back
        </Button>
        <h2 className="text-gradient m-0">
          {totals.isLiquor ? "Premium Menu" : "Exquisite Menu"}
        </h2>
      </div>

      <div className="category-tabs mb-6">
        {menuData.map(cat => (
          <button
            key={cat.category}
            className={`category-tab ${activeCategory === cat.category ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.category)}
          >
            {cat.category}
          </button>
        ))}
      </div>

      <Section title={activeCategory} className="mb-0 text-left">
        <div className="desktop-grid" style={{ gap: '1rem' }}>
          {menuData.find(c => c.category === activeCategory)?.items.map(item => {
            const qty = getQuantity(item.id);
            const isSelected = qty > 0;
            
            return (
              <div key={item.id} className="menu-item-card" style={isSelected ? { borderColor: 'var(--primary)', background: 'rgba(22, 163, 74, 0.05)' } : {}}>
                <div>
                  <h4 className="mb-2" style={{ color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>{item.name}</h4>
                  <span className="font-bold text-secondary">₹{item.price}</span>
                </div>
                
                <div className="flex-center" style={{ gap: '0.75rem' }}>
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item, -1)}
                    disabled={qty === 0}
                    style={qty === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold" style={{ minWidth: '20px', textAlign: 'center' }}>{qty}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item, 1)}
                    style={{ background: 'var(--primary)', color: '#0f172a' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Sticky Bottom Bar */}
      <div className="sticky-bottom-bar">
        <div className="flex-center" style={{ gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
            <ShoppingBag size={24} color="var(--primary)" />
          </div>
          <div>
            <div className="text-secondary text-sm">{totalItemCount} Items</div>
            <div className="font-bold text-gradient" style={{ fontSize: '1.25rem' }}>₹{totals.finalTotal}</div>
          </div>
        </div>
        
        <Button 
          onClick={handleContinue}
          disabled={totalItemCount === 0}
          style={{ width: 'auto', padding: '12px 24px' }}
        >
          Continue <ArrowRight size={18} />
        </Button>
      </div>
    </PageWrapper>
  );
}
