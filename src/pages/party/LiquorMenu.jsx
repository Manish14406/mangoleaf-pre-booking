import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

const MENU_ITEMS = [
  { category: "Whiskey", items: ["Jack Daniel's Old No. 7", "Johnnie Walker Black Label", "Chivas Regal 12 YO", "Jameson Irish Whiskey", "Maker's Mark Bourbon"] },
  { category: "Vodka", items: ["Grey Goose", "Absolut", "Smirnoff No. 21", "Belvedere", "Ketel One"] },
  { category: "Rum", items: ["Bacardi Superior", "Captain Morgan Spiced", "Old Monk", "Malibu Coconut", "Havana Club 7 YO"] },
  { category: "Tequila", items: ["Jose Cuervo Especial", "Patrón Silver", "Don Julio Blanco", "1800 Añejo", "Herradura Reposado"] },
  { category: "Gin", items: ["Bombay Sapphire", "Tanqueray", "Hendrick's", "Beefeater", "Gordon's"] },
  { category: "Beer", items: ["Heineken", "Corona Extra", "Budweiser", "Stella Artois", "Guinness Draught"] },
  { category: "Wine", items: ["Jacob's Creek Shiraz", "Sula Chenin Blanc", "Moët & Chandon Brut", "Beringer White Zinfandel", "Yellow Tail Merlot"] },
  { category: "Cocktails", items: ["Classic Mojito", "Margarita", "Dry Martini", "Long Island Iced Tea", "Cosmopolitan"] },
  { category: "Premium Spirits", items: ["Glenfiddich 18 YO", "Macallan Double Cask 12 YO", "Hennessy V.S.O.P", "Ron Zacapa Centenario", "Clase Azul Reposado"] }
];

export default function LiquorMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const prevState = location.state;

  if (!prevState || prevState.menuType !== 'liquor') {
    return <Navigate to="/party" />;
  }

  const handleContinue = () => {
    navigate('/party/payment', { state: prevState });
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
          <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Premium Liquor Menu</h2>
          <p style={{ color: 'var(--text-muted)' }}>Curated selection for your party hall event</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {MENU_ITEMS.map((section, idx) => (
            <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                {section.category}
              </h3>
              <ul style={{ listStyle: 'none' }}>
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    <Check size={14} style={{ color: 'var(--secondary)', marginRight: '0.5rem', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            * This is a sample menu. Final items and brands are subject to availability.
          </div>
          <button className="btn-primary" style={{ width: 'auto', marginTop: 0 }} onClick={handleContinue}>
            Confirm Menu & Proceed <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
