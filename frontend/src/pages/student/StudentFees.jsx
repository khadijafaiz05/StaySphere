import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
const API = 'http://localhost:3000/api';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('ss_token')}`
});

export default function StudentFees() {
  const { user } = useAuth();
  const studentId = user?.studentId;

  const [fees, setFees] = useState([]);
  const [alert, setAlert] = useState(null);

  const loadFees = async () => {
    try {
      const res = await fetch(`${API}/fees/student/${studentId}`, { headers: authHeader() });
      if (!res.ok) throw new Error('Failed to load fees');
      setFees(await res.json());
    } catch (e) { showAlert(e.message, 'error'); }
  };

  useEffect(() => { if (studentId) loadFees(); }, [studentId]);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const payFee = async (feeId, amount) => {
    const paymentDate = new Date().toISOString().split('T')[0];
    try {
      const res = await fetch(`${API}/fees/payment`, {
        method: 'POST', headers: authHeader(),
        body: JSON.stringify({ fee_id: feeId, amount_paid: amount, payment_date: paymentDate })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');
      showAlert('Payment successful!');
      loadFees();
    } catch (e) { showAlert(e.message, 'error'); }
  };

  const totalAmount = fees.reduce((a, f) => a + Number(f.amount || 0), 0);
  const totalPaid = fees.filter(f => f.status === 'Paid').length;
  const totalPending = fees.filter(f => f.status === 'Pending').length;
  const amountPaid = fees.filter(f => f.status === 'Paid').reduce((a, f) => a + Number(f.amount || 0), 0);
  const pct = totalAmount > 0 ? Math.round(amountPaid / totalAmount * 100) : 0;

  return (
    <div className="page fade-in">

      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h2>My Fees</h2>
          <p>View and pay your outstanding fee challans</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Fees</div>
          <div className="value">₨{(totalAmount / 1000).toFixed(0)}k</div>
          <div className="sub">₨{totalAmount.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="label">Paid</div>
          <div className="value" style={{ color: 'var(--success)' }}>{totalPaid}</div>
          <div className="sub">Completed challans</div>
        </div>
        <div className="stat-card">
          <div className="label">Pending</div>
          <div className="value" style={{ color: '#e09a4a' }}>{totalPending}</div>
          <div className="sub">Awaiting payment</div>
        </div>
        <div className="stat-card">
          <div className="label">Payment Progress</div>
          <div className="value" style={{ fontSize: '1.5rem' }}>{pct}%</div>
          <div className="progress-bar" style={{ marginTop: 12 }}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Fee challans */}
      {fees.length === 0 ? (
        <div className="empty">
          <div className="icon">💳</div>
          <p>No fee records found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {fees.map(fee => (
            <div key={fee.fee_id} style={{
              background: 'var(--card-bg)',
              border: `1px solid ${fee.status === 'Paid' ? 'rgba(34,197,94,0.2)' : 'rgba(224,154,74,0.2)'}`,
              borderRadius: 14,
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 20,
              transition: '0.2s',
            }}>
              {/* Icon */}
              <div style={{
                width: 44, height: 44,
                background: fee.status === 'Paid' ? 'rgba(34,197,94,0.1)' : 'rgba(224,154,74,0.1)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', flexShrink: 0,
              }}>
                {fee.status === 'Paid' ? '✓' : '💳'}
              </div>

              {/* Details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ color: 'white', fontWeight: 600 }}>Fee #{fee.fee_id}</span>
                  <span className={`badge ${fee.status === 'Paid' ? 'badge-success' : 'badge-warn'}`}
                    style={fee.status !== 'Paid' ? { background: 'rgba(224,154,74,0.15)', color: '#e09a4a' } : {}}>
                    {fee.status}
                  </span>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                  Due: {fee.due_date?.substring(0, 10)}
                </div>
              </div>

              {/* Amount */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 700, color: '#d4a373' }}>
                  ₨{Number(fee.amount).toLocaleString()}
                </div>
              </div>

              {/* Pay button */}
              {fee.status === 'Pending' && (
                <button
                  className="btn btn-primary"
                  style={{ width: 'auto', padding: '10px 20px', fontSize: '0.88rem' }}
                  onClick={() => payFee(fee.fee_id, fee.amount)}
                >
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
