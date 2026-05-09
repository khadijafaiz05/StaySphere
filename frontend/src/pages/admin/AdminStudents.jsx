import { useEffect, useState } from 'react';
import API from '../../api/api';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [alert, setAlert] = useState(null);

  const load = async () => {
    const { data } = await API.get('/students');
    setStudents(data);
  };

  useEffect(() => { load(); }, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    try {
      await API.post('/students', form);
      setModal(null); setForm({});
      showAlert('Student added successfully');
      load();
    } catch (e) { showAlert(e.response?.data?.error || 'Error', 'error'); }
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/students/${form.student_id}`, form);
      setModal(null); setForm({});
      showAlert('Student updated');
      load();
    } catch (e) { showAlert(e.response?.data?.error || 'Error', 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/students/${id}`);
      showAlert('Student removed');
      load();
    } catch (e) { showAlert(e.response?.data?.error || 'Error', 'error'); }
  };

  const totalFees = students.reduce((a, s) => a + Number(s.total_fees || 0), 0);
  const totalPaid = students.reduce((a, s) => a + Number(s.total_paid || 0), 0);
  const pct = totalFees ? Math.round(totalPaid / totalFees * 100) : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">
          <h2>Student Management</h2>
          <p>Manage resident students and their records</p>
        </div>
        <button className="btn btn-ghost" onClick={() => { setForm({}); setModal('add'); }}>
          + Add Student
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Students</div>
          <div className="value">{students.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Rooms Assigned</div>
          <div className="value">{students.filter(s => s.room_number).length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Fees</div>
          <div className="value">₨{(totalFees / 1000).toFixed(0)}k</div>
        </div>
        <div className="stat-card">
          <div className="label">Amount Paid</div>
          <div className="value">₨{(totalPaid / 1000).toFixed(0)}k</div>
          <div className="sub">{pct}% collected
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <h3>All Students ({filtered.length})</h3>
          <input className="search-input" placeholder="Search…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table>
          <thead><tr>
            <th>#</th><th>Name</th><th>Phone</th><th>Room</th><th>Address</th><th>Fees</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.student_id}>
                <td>{s.student_id}</td>
                <td><div style={{fontWeight:600}}>{s.name}</div><div style={{fontSize:'0.78rem',color:'var(--muted)'}}>{s.username}</div></td>
                <td>{s.phone || '—'}</td>
                <td>{s.room_number ? <span className="badge badge-info">{s.room_number}</span> : <span className="badge badge-muted">Unassigned</span>}</td>
                <td>{s.address || '—'}</td>
                <td>₨{Number(s.total_fees || 0).toLocaleString()}</td>
                <td>
                  <button className="btn btn-sm btn-info" onClick={() => { setForm(s); setModal('edit'); }}>Edit</button>
                  {' '}
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.student_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target.className === 'modal-overlay' && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Add New Student' : 'Edit Student'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="form-group"><label>Full Name</label>
              <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            {modal === 'add' && <>
              <div className="form-group"><label>Username</label>
                <input value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
              <div className="form-group"><label>Password</label>
                <input type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
            </>}
            <div className="form-group"><label>Phone</label>
              <input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="form-group"><label>Address</label>
              <input value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{width:'auto'}}
                onClick={modal === 'add' ? handleAdd : handleUpdate}>
                {modal === 'add' ? 'Add Student' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}