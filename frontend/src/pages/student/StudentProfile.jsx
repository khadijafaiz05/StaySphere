import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/api';

export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get(`/students/${user.studentId}/profile`).then(r => setProfile(r.data));
  }, [user.studentId]);

  if (!profile) return <div className="loading"><div className="spinner"></div> Loading…</div>;

  const balance = Number(profile.total_fees || 0) - Number(profile.total_paid || 0);
  const pct = profile.total_fees > 0 ? Math.round(profile.total_paid / profile.total_fees * 100) : 0;
  const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const fmt = d => d ? new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title"><h2>My Profile</h2><p>Your resident information</p></div>
      </div>
      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-name">{profile.name}</div>
          <div className="profile-meta">{profile.username}</div>
          <span className="role-badge role-student">Student</span>
          {profile.room_number ? (
            <div style={{background:'rgba(94,170,189,0.08)',border:'1px solid rgba(94,170,189,0.2)',borderRadius:'10px',padding:'0.8rem 1.2rem',width:'100%',textAlign:'center'}}>
              <div style={{fontSize:'0.75rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600}}>Assigned Room</div>
              <div style={{fontFamily:'serif',fontSize:'1.6rem',color:'var(--info)',fontWeight:700}}>{profile.room_number}</div>
              <div style={{fontSize:'0.8rem',color:'var(--muted)'}}>{profile.room_type} · Since {fmt(profile.allocation_date)}</div>
            </div>
          ) : <span className="badge badge-muted">No room assigned</span>}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div className="info-card">
            <h3>Personal Info</h3>
            <div className="info-row"><span className="key">Phone</span><span className="val">{profile.phone || '—'}</span></div>
            <div className="info-row"><span className="key">Gender</span><span className="val">{profile.gender || '—'}</span></div>
            <div className="info-row"><span className="key">Address</span><span className="val">{profile.address || '—'}</span></div>
          </div>
          <div className="info-card">
            <h3>Fee Summary</h3>
            <div className="info-row"><span className="key">Total Charged</span><span className="val">₨{Number(profile.total_fees || 0).toLocaleString()}</span></div>
            <div className="info-row"><span className="key">Amount Paid</span><span className="val" style={{color:'var(--success)'}}>₨{Number(profile.total_paid || 0).toLocaleString()}</span></div>
            <div className="info-row"><span className="key">Balance Due</span><span className="val" style={{color:balance>0?'var(--danger)':'var(--success)'}}>₨{balance.toLocaleString()}</span></div>
            <div style={{marginTop:'0.8rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.8rem',color:'var(--muted)',marginBottom:'0.3rem'}}>
                <span>Payment Progress</span><span>{pct}%</span>
              </div>
              <div className="progress-bar" style={{height:'8px'}}><div className="progress-fill" style={{width:`${pct}%`}} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}