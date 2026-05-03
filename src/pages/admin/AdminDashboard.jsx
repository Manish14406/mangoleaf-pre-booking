import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PageWrapper from '../../components/PageWrapper';
import { RefreshCw, Filter, DollarSign, Calendar, Hash, CheckCircle, XCircle } from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────
const getTodayString = () => {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
};

const STATUS_STYLES = {
  confirmed: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'Confirmed' },
  pending:   { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: 'Pending' },
  cancelled: { bg: 'rgba(239,68,68,0.15)',  color: '#ef4444', label: 'Cancelled' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', label: status };
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      padding: '0.3rem 0.8rem',
      borderRadius: '999px',
      fontSize: '0.78rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function AdminDashboard() {
  const [allBookings, setAllBookings]   = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState(null);
  const [actionId, setActionId]         = useState(null);   // tracks which row is updating
  const [showTodayOnly, setShowTodayOnly] = useState(true); // today-filter toggle

  // ── Fetch ──────────────────────────────────────────────────
  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('table_bookings')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        setError('Failed to load bookings. Check RLS policies.');
      } else {
        setAllBookings(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Real-time: listen for any change and refresh
    const channel = supabase
      .channel('admin-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'table_bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ── Update Status ──────────────────────────────────────────
  const updateStatus = async (id, newStatus) => {
    setActionId(id);
    try {
      const { error: updateError } = await supabase
        .from('table_bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) {
        console.error('Update error:', updateError);
        alert('Failed to update status: ' + updateError.message);
      } else {
        // Optimistic local update (also triggers real-time refresh)
        setAllBookings(prev =>
          prev.map(b => b.id === id ? { ...b, status: newStatus } : b)
        );
      }
    } catch (err) {
      console.error('Unexpected update error:', err);
      alert('Unexpected error while updating.');
    } finally {
      setActionId(null);
    }
  };

  // ── Filter ─────────────────────────────────────────────────
  const today = getTodayString();
  const displayed = showTodayOnly
    ? allBookings.filter(b => b.date === today)
    : allBookings;

  // ── Stats ──────────────────────────────────────────────────
  const todayBookings  = allBookings.filter(b => b.date === today);
  const confirmedToday = todayBookings.filter(b => b.status === 'confirmed').length;
  const revenueToday   = todayBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (Number(b.total) || 0), 0);

  // ─────────────────────────────────────────────────────────
  return (
    <PageWrapper
      className="main-content"
      style={{ gridTemplateColumns: '1fr', maxWidth: '1200px', margin: '0 auto' }}
    >
      <div className="glass-panel">

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ margin: 0 }}>Admin Panel</h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              id="toggle-today-filter"
              onClick={() => setShowTodayOnly(v => !v)}
              className="btn-secondary"
              style={{ width: 'auto', marginTop: 0, padding: '0.6rem 1.1rem' }}
            >
              <Filter size={16} />
              {showTodayOnly ? "Show All" : "Today Only"}
            </button>
            <button
              id="refresh-bookings"
              onClick={fetchBookings}
              className="btn-secondary"
              disabled={isLoading}
              style={{ width: 'auto', marginTop: 0, padding: '0.6rem 1.1rem' }}
            >
              <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard icon={<Calendar size={22} />} iconBg="rgba(217,119,6,0.2)" iconColor="var(--primary)"  label="Bookings Today" value={todayBookings.length} />
          <StatCard icon={<CheckCircle size={22} />} iconBg="rgba(16,185,129,0.2)" iconColor="#10b981"     label="Confirmed Today" value={confirmedToday} />
          <StatCard icon={<DollarSign size={22} />} iconBg="rgba(59,130,246,0.2)" iconColor="#3b82f6"      label="Revenue Today" value={`₹${revenueToday}`} />
          <StatCard icon={<Hash size={22} />} iconBg="rgba(168,85,247,0.2)" iconColor="#a855f7"            label="Total Bookings" value={allBookings.length} />
        </div>

        {/* ── Filter label ── */}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
          {showTodayOnly
            ? `Showing bookings for today (${today}) — ${displayed.length} record(s)`
            : `Showing all bookings — ${displayed.length} record(s)`}
        </p>

        {/* ── Error ── */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', padding: '1rem', borderRadius: '8px', color: '#ef4444', marginBottom: '1.5rem' }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Table ── */}
        <div style={{ overflowX: 'auto', background: 'rgba(15,23,42,0.4)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          {isLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading bookings…
            </div>
          ) : displayed.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No bookings found.
            </div>
          ) : (
            <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ background: 'rgba(15,23,42,0.8)', borderBottom: '1px solid var(--border-color)' }}>
                  {['Table', 'Name', 'Phone', 'People', 'Date', 'Time', 'Total', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map((b, idx) => {
                  const isUpdating = actionId === b.id;
                  return (
                    <tr
                      key={b.id || idx}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                        opacity: isUpdating ? 0.5 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--primary)' }}>
                        {b.table_id ?? '—'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 500 }}>{b.name}</td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{b.phone}</td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{b.people}</td>
                      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>{b.date}</td>
                      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>{b.time}</td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--primary)', fontWeight: 600 }}>
                        ₹{b.total}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <StatusBadge status={b.status} />
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <ActionButtons
                          status={b.status}
                          isUpdating={isUpdating}
                          onConfirm={() => updateStatus(b.id, 'confirmed')}
                          onCancel={() => updateStatus(b.id, 'cancelled')}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Inline animation style */}
      <style>{`
        .spinning { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .admin-btn-confirm {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 0.35rem 0.8rem; border-radius: 6px; border: none; cursor: pointer;
          font-size: 0.8rem; font-weight: 600; transition: opacity 0.2s;
          background: rgba(16,185,129,0.15); color: #10b981;
        }
        .admin-btn-confirm:hover { opacity: 0.75; }
        .admin-btn-cancel {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 0.35rem 0.8rem; border-radius: 6px; border: none; cursor: pointer;
          font-size: 0.8rem; font-weight: 600; transition: opacity 0.2s;
          background: rgba(239,68,68,0.15); color: #ef4444;
        }
        .admin-btn-cancel:hover { opacity: 0.75; }
        .admin-btn-confirm:disabled, .admin-btn-cancel:disabled {
          cursor: not-allowed; opacity: 0.4;
        }
      `}</style>
    </PageWrapper>
  );
}

// ── Sub-components ──────────────────────────────────────────

function StatCard({ icon, iconBg, iconColor, label, value }) {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.6)',
      padding: '1.25rem',
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <div style={{ background: iconBg, padding: '0.75rem', borderRadius: '50%', color: iconColor, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>
          {label}
        </p>
        <h3 style={{ fontSize: '1.6rem', margin: 0 }}>{value}</h3>
      </div>
    </div>
  );
}

function ActionButtons({ status, isUpdating, onConfirm, onCancel }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap' }}>
      {/* Confirm button — hide if already confirmed */}
      {status !== 'confirmed' && (
        <button
          id={`btn-confirm`}
          className="admin-btn-confirm"
          onClick={onConfirm}
          disabled={isUpdating}
          title="Mark as Confirmed"
        >
          <CheckCircle size={13} /> Confirm
        </button>
      )}

      {/* Cancel button — hide if already cancelled */}
      {status !== 'cancelled' && (
        <button
          id={`btn-cancel`}
          className="admin-btn-cancel"
          onClick={onCancel}
          disabled={isUpdating}
          title="Mark as Cancelled"
        >
          <XCircle size={13} /> Cancel
        </button>
      )}

      {/* If both are hidden (shouldn't happen), show nothing */}
      {status === 'confirmed' && status === 'cancelled' && (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
      )}
    </div>
  );
}
