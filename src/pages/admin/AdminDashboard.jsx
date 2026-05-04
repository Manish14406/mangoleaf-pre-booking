import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PageWrapper from '../../components/PageWrapper';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Section from '../../components/Section';
import { RefreshCw, Filter, DollarSign, Calendar, Hash, CheckCircle, XCircle } from 'lucide-react';

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
      padding: '4px 12px',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

export default function AdminDashboard() {
  const [allBookings, setAllBookings]   = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState(null);
  const [actionId, setActionId]         = useState(null);
  const [showTodayOnly, setShowTodayOnly] = useState(true);
  const [bookingType, setBookingType]   = useState('party');

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data, fetchError;
      
      if (bookingType === 'party') {
        const res = await supabase
          .from('party_bookings')
          .select('*')
          .order('created_at', { ascending: false });
        data = res.data;
        fetchError = res.error;
      } else {
        const res = await supabase
          .from('table_bookings')
          .select('*')
          .order('date', { ascending: true })
          .order('time', { ascending: true });
        data = res.data;
        fetchError = res.error;
      }

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

    const channel = supabase
      .channel('admin-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: bookingType === 'table' ? 'table_bookings' : 'party_bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [bookingType]);

  const updateStatus = async (id, newStatus) => {
    setActionId(id);
    try {
      const tableName = bookingType === 'table' ? 'table_bookings' : 'party_bookings';
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) {
        console.error('Update error:', updateError);
        alert('Failed to update status: ' + updateError.message);
      } else {
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

  const today = getTodayString();
  const displayed = showTodayOnly
    ? allBookings.filter(b => b.date === today)
    : allBookings;

  const todayBookings  = allBookings.filter(b => b.date === today);
  const confirmedToday = todayBookings.filter(b => b.status === 'confirmed').length;
  const revenueToday   = todayBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (Number(b.total) || 0), 0);

  return (
    <PageWrapper className="app-container" style={{ maxWidth: '1200px' }}>
      <div className="flex-between mb-8" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="m-0">Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="category-tabs" style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
            <button
              className={`category-tab ${bookingType === 'party' ? 'active' : ''}`}
              onClick={() => setBookingType('party')}
              style={{ margin: 0, borderRadius: 0, border: 'none' }}
            >
              Party Bookings
            </button>
            <button
              className={`category-tab ${bookingType === 'table' ? 'active' : ''}`}
              onClick={() => setBookingType('table')}
              style={{ margin: 0, borderRadius: 0, border: 'none' }}
            >
              Table Bookings
            </button>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowTodayOnly(v => !v)}
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
          >
            <Filter size={16} />
            <span className="hidden sm:inline">{showTodayOnly ? "Show All" : "Today Only"}</span>
          </Button>
          <Button
            variant="secondary"
            onClick={fetchBookings}
            disabled={isLoading}
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
          >
            <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="desktop-grid mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <StatCard icon={<Calendar size={24} />} iconBg="rgba(217,119,6,0.2)" iconColor="var(--primary)"  label="Bookings Today" value={todayBookings.length} />
        <StatCard icon={<CheckCircle size={24} />} iconBg="rgba(16,185,129,0.2)" iconColor="#10b981"     label="Confirmed Today" value={confirmedToday} />
        <StatCard icon={<DollarSign size={24} />} iconBg="rgba(59,130,246,0.2)" iconColor="#3b82f6"      label="Revenue Today" value={`₹${revenueToday}`} />
        <StatCard icon={<Hash size={24} />} iconBg="rgba(168,85,247,0.2)" iconColor="#a855f7"            label="Total Bookings" value={allBookings.length} />
      </div>

      <Section 
        title={`${bookingType === 'party' ? 'Party' : 'Table'} Bookings`} 
        subtitle={showTodayOnly ? `Showing bookings for today (${today}) — ${displayed.length} record(s)` : `Showing all bookings — ${displayed.length} record(s)`}
        className="text-left"
      />

      {error && (
        <Card className="mb-6" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444' }}>
          <p className="text-error m-0 font-medium">⚠ {error}</p>
        </Card>
      )}

      {isLoading ? (
        <div className="flex-center py-12 text-secondary">
          <RefreshCw size={24} className="spinning mr-2" /> Loading bookings...
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex-center py-12 text-secondary">
          No bookings found.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <Card className="hidden md:block overflow-x-auto p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                  {bookingType === 'table' ? (
                    ['Table', 'Name', 'Phone', 'People', 'Date & Time', 'Total', 'Status', 'Actions'].map(h => (
                      <th key={h} className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider whitespace-nowrap border-b border-white/10">
                        {h}
                      </th>
                    ))
                  ) : (
                    ['Type', 'Name', 'Phone', 'Guests', 'Date & Time', 'Total', 'Advance', 'Status', 'Actions'].map(h => (
                      <th key={h} className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider whitespace-nowrap border-b border-white/10">
                        {h}
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayed.map((b) => {
                  const isUpdating = actionId === b.id;
                  return (
                    <tr key={b.id} style={{ opacity: isUpdating ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                      {bookingType === 'table' ? (
                        <>
                          <td className="p-4 font-bold text-primary">{b.table_id ?? '—'}</td>
                          <td className="p-4 font-medium">{b.name}</td>
                          <td className="p-4 text-secondary">{b.phone}</td>
                          <td className="p-4">{b.people}</td>
                          <td className="p-4 whitespace-nowrap">
                            {b.date} <br/><span className="text-sm text-secondary">{b.time}</span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-4 font-bold text-primary capitalize">{b.party_type || b.menu_type || '—'}</td>
                          <td className="p-4 font-medium">{b.name}</td>
                          <td className="p-4 text-secondary">{b.phone}</td>
                          <td className="p-4">{b.guests || b.people}</td>
                          <td className="p-4 whitespace-nowrap">
                            {b.date} <br/>
                            <span className="text-sm text-secondary">
                              {b.time === 'morning' ? '12 PM - 3 PM' : b.time === 'night' ? '7 PM - 11 PM' : b.time}
                            </span>
                          </td>
                        </>
                      )}
                      <td className="p-4 font-bold text-gradient">₹{b.total}</td>
                      {bookingType === 'party' && (
                        <td className="p-4 font-medium">{b.advance_paid ? `₹${b.advance_paid}` : '—'}</td>
                      )}
                      <td className="p-4">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="p-4">
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
          </Card>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-4">
            {displayed.map((b) => {
              const isUpdating = actionId === b.id;
              return (
                <Card key={b.id} style={{ padding: '1rem', opacity: isUpdating ? 0.5 : 1 }}>
                  <div className="flex-between mb-3 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="font-bold text-primary capitalize mb-1">
                        {bookingType === 'table' ? `Table ${b.table_id ?? '—'}` : (b.party_type || b.menu_type || 'Party')}
                      </h4>
                      <div className="text-sm text-secondary">{b.date} at {bookingType === 'party' && b.time === 'morning' ? '12 PM - 3 PM' : bookingType === 'party' && b.time === 'night' ? '7 PM - 11 PM' : b.time}</div>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  
                  <div className="mb-4">
                    <div className="font-medium text-lg">{b.name}</div>
                    <div className="text-secondary flex-between text-sm mt-1">
                      <span>{b.phone}</span>
                      <span><Users size={14} className="inline mr-1" /> {b.people || b.guests}</span>
                    </div>
                  </div>

                  <div className="flex-between bg-black/20 p-3 rounded-lg mb-4">
                    <div>
                      <div className="text-xs text-secondary uppercase tracking-wider mb-1">Total Amount</div>
                      <div className="font-bold text-gradient text-lg">₹{b.total}</div>
                    </div>
                    {bookingType === 'party' && b.advance_paid && (
                      <div className="text-right">
                        <div className="text-xs text-secondary uppercase tracking-wider mb-1">Advance</div>
                        <div className="font-medium">₹{b.advance_paid}</div>
                      </div>
                    )}
                  </div>

                  <ActionButtons
                    status={b.status}
                    isUpdating={isUpdating}
                    onConfirm={() => updateStatus(b.id, 'confirmed')}
                    onCancel={() => updateStatus(b.id, 'cancelled')}
                    fullWidth={true}
                  />
                </Card>
              );
            })}
          </div>
        </>
      )}

      <style>{`
        .spinning { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .admin-btn-confirm {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;
          font-size: 0.85rem; font-weight: 600; transition: all 0.2s;
          background: rgba(16,185,129,0.15); color: #10b981;
        }
        .admin-btn-confirm:hover:not(:disabled) { background: rgba(16,185,129,0.25); transform: translateY(-1px); }
        
        .admin-btn-cancel {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;
          font-size: 0.85rem; font-weight: 600; transition: all 0.2s;
          background: rgba(239,68,68,0.15); color: #ef4444;
        }
        .admin-btn-cancel:hover:not(:disabled) { background: rgba(239,68,68,0.25); transform: translateY(-1px); }
        
        .admin-btn-confirm:disabled, .admin-btn-cancel:disabled {
          cursor: not-allowed; opacity: 0.5; filter: grayscale(1);
        }

        .hidden { display: none !important; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .gap-4 { gap: 1rem; }
        .w-full { width: 100%; }
        .text-left { text-align: left; }
        .border-collapse { border-collapse: collapse; }
        .p-4 { padding: 1rem; }
        .p-0 { padding: 0; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
        .pb-3 { padding-bottom: 0.75rem; }
        .mb-1 { margin-bottom: 0.25rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mt-1 { margin-top: 0.25rem; }
        .mr-1 { margin-right: 0.25rem; }
        .mr-2 { margin-right: 0.5rem; }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-lg { font-size: 1.125rem; }
        .font-semibold { font-weight: 600; }
        .tracking-wider { letter-spacing: 0.05em; }
        .uppercase { text-transform: uppercase; }
        .capitalize { text-transform: capitalize; }
        .whitespace-nowrap { white-space: nowrap; }
        .border-b { border-bottom-width: 1px; }
        .border-white\\/10 { border-color: rgba(255,255,255,0.1); }
        .divide-y > * + * { border-top-width: 1px; border-color: rgba(255,255,255,0.05); }
        .inline { display: inline; }
        .rounded-lg { border-radius: 0.5rem; }
        .bg-black\\/20 { background-color: rgba(0,0,0,0.2); }
        .text-right { text-align: right; }
        
        @media (min-width: 768px) {
          .md\\:hidden { display: none !important; }
          .md\\:block { display: block !important; }
          .sm\\:inline { display: inline !important; }
        }
      `}</style>
    </PageWrapper>
  );
}

function StatCard({ icon, iconBg, iconColor, label, value }) {
  return (
    <Card style={{ padding: '1.25rem' }}>
      <div className="flex-center" style={{ gap: '1rem', justifyContent: 'flex-start' }}>
        <div style={{ background: iconBg, padding: '1rem', borderRadius: '50%', color: iconColor }}>
          {icon}
        </div>
        <div>
          <p className="text-secondary mb-1 uppercase tracking-wider text-xs font-semibold">
            {label}
          </p>
          <h3 className="m-0 text-gradient" style={{ fontSize: '1.75rem' }}>{value}</h3>
        </div>
      </div>
    </Card>
  );
}

function ActionButtons({ status, isUpdating, onConfirm, onCancel, fullWidth = false }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', width: fullWidth ? '100%' : 'auto' }}>
      {status !== 'confirmed' && (
        <button
          className="admin-btn-confirm"
          onClick={onConfirm}
          disabled={isUpdating}
          style={{ flex: fullWidth ? 1 : 'none' }}
        >
          <CheckCircle size={14} /> Confirm
        </button>
      )}

      {status !== 'cancelled' && (
        <button
          className="admin-btn-cancel"
          onClick={onCancel}
          disabled={isUpdating}
          style={{ flex: fullWidth ? 1 : 'none' }}
        >
          <XCircle size={14} /> Cancel
        </button>
      )}

      {status === 'confirmed' && status === 'cancelled' && (
        <span className="text-secondary text-sm">—</span>
      )}
    </div>
  );
}
