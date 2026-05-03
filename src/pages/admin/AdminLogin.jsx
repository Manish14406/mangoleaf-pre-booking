import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

// ⚠️ In production, use environment variable or Supabase Auth.
// For now this is a simple session-based password gate.
const ADMIN_PASSWORD = 'mangoleaf@admin';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [shaking, setShaking]   = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      // Store auth flag for this session only (cleared on tab close)
      sessionStorage.setItem('admin_auth', 'true');
      navigate('/admin', { replace: true });
    } else {
      setError('Incorrect password. Please try again.');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <PageWrapper className="main-content" style={{ gridTemplateColumns: '1fr', maxWidth: '420px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ textAlign: 'center' }}>

        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(217,119,6,0.15)',
          border: '1px solid rgba(217,119,6,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'var(--primary)',
        }}>
          <ShieldCheck size={28} />
        </div>

        <h2 style={{ marginBottom: '0.5rem' }}>Admin Access</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Enter your admin password to continue
        </p>

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">
              <Lock size={12} style={{ display: 'inline', marginRight: 4 }} />
              Password
            </label>

            {/* Password input wrapper */}
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type={showPw ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter admin password"
                autoFocus
                autoComplete="current-password"
                style={{
                  paddingRight: '3rem',
                  animation: shaking ? 'shake 0.4s ease' : 'none',
                  borderColor: error ? 'var(--error)' : undefined,
                }}
              />
              {/* Show / hide toggle */}
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: 'absolute', right: '0.9rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: '4px',
                }}
                tabIndex={-1}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="error-message" style={{ marginTop: '0.5rem' }}>
                {error}
              </p>
            )}
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            className="btn-primary"
            disabled={!password}
          >
            <Lock size={16} /> Unlock Admin Panel
          </button>
        </form>
      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </PageWrapper>
  );
}
