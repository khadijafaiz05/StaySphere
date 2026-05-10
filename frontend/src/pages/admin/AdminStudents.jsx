import { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('ss_token')}`
});

export default function AdminStudents() {
  const [students,   setStudents]   = useState([]);
  const [search,     setSearch]     = useState('');
  const [modal,      setModal]      = useState(null);   // 'add' | 'edit' | null
  const [form,       setForm]       = useState({});
  const [alert,      setAlert]      = useState(null);   // { msg, type }
  const [deleteId,   setDeleteId]   = useState(null);   // student_id pending delete confirm
  const [cities,     setCities]     = useState([]);

  /* ── data loading ── */
  const load = async () => {
    try {
      const res  = await fetch(`${API}/students`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load students');
      setStudents(data);
    } catch (e) { showAlert(e.message, 'error'); }
  };

  const loadCities = async () => {
    try {
      const res  = await fetch(`${API}/students/cities`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load cities');
      setCities(data);
    } catch (e) { showAlert(e.message, 'error'); }
  };

  useEffect(() => { load(); loadCities(); }, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    try {
      const res  = await fetch(`${API}/students`, {
        method: 'POST', headers: authHeader(),
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          name:     form.name,
          phone:    form.phone,
          street:   form.street,
          city_id:  form.city_id,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add student');
      setModal(null); setForm({});
      showAlert('Student added successfully');
      load();
    } catch (e) {
      setModal(null); setForm({});
      showAlert(e.message, 'error');
    }
  };

  const handleUpdate = async () => {
    try {
      const res  = await fetch(`${API}/students/${form.student_id}`, {
        method: 'PUT', headers: authHeader(),
        body: JSON.stringify({
          name:    form.name,
          phone:   form.phone,
          street:  form.street,
          city_id: form.city_id,   // ← now included in update
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update student');
      setModal(null); setForm({});
      showAlert('Student updated');
      load();
    } catch (e) {
      setModal(null); setForm({});
      showAlert(e.message, 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const res  = await fetch(`${API}/students/${deleteId}`, {
        method: 'DELETE', headers: authHeader()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete student');
      setDeleteId(null);
      showAlert('Student removed');
      load();
    } catch (e) {
      setDeleteId(null);
      showAlert(e.message, 'error');
    }
  };

  const totalFees = students.reduce((a, s) => a + Number(s.total_fees || 0), 0);
  const totalPaid = students.reduce((a, s) => a + Number(s.total_paid || 0), 0);
  const pct = totalFees ? Math.round(totalPaid / totalFees * 100) : 0;

  const deleteName = students.find(s => s.student_id === deleteId)?.name ?? '';

  // When opening edit modal, pre-select the city by matching city_name → city_id
  const openEdit = (s) => {
    const matched = cities.find(c => c.city_name === s.city_name);
    setForm({ ...s, city_id: matched ? String(matched.city_id) : '' });
    setModal('edit');
  };

  return (
    <div className="page fade-in">

      {/*  Page header  */}
      <div className="page-header">
        <div className="page-title">
          <h2>Students</h2>
          <p>Manage hostel residents and their details</p>
        </div>
        <button
          className="btn btn-primary"
          style={{ width: 'auto' }}
          onClick={() => { setForm({}); setModal('add'); }}
        >
          + Add Student
        </button>
      </div>

      {/*  Alert banner  */}
      {alert && (
        <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {alert.msg}
        </div>
      )}

      {/*  Summary stats  */}
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
          <div className="sub">₨{totalFees.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="label">Fee Collection</div>
          <div className="value">{pct}%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/*  Students table  */}
      <div className="table-wrap">
        <div className="table-toolbar">
          <h3>All Students</h3>
          <input
            className="search-input"
            placeholder="Search by name or username…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Room</th>
              <th>Address</th>
              <th>City</th>
              <th>Total Fees</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.student_id}>
                <td style={{ color: 'var(--muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.82rem' }}>
                  {s.student_id}
                </td>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', color: 'var(--muted)' }}>
                  {s.username}
                </td>
                <td>{s.phone || '—'}</td>
                <td>
                  {s.room_number
                    ? <span className="badge badge-success">{s.room_number}</span>
                    : <span className="badge badge-muted">Unassigned</span>
                  }
                </td>
                <td>{s.street || '—'}</td>
                <td>{s.city_name || '—'}</td>
                <td style={{ fontFamily: "'DM Mono', monospace" }}>
                  ₨{Number(s.total_fees || 0).toLocaleString()}
                </td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => openEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setDeleteId(s.student_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="empty">
            <div className="icon">👥</div>
            <p>No students found</p>
          </div>
        )}
      </div>

      {/*  Add or Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Add New Student' : 'Edit Student'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input
                value={form.name || ''}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ali Hassan"
              />
            </div>

            {modal === 'add' && (
              <>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    value={form.username || ''}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    placeholder="e.g. alihassan"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={form.password || ''}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Phone</label>
              <input
                value={form.phone || ''}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="03xx-xxxxxxx"
              />
            </div>

            <div className="form-group">
              <label>Street Address</label>
              <input
                value={form.street || ''}
                onChange={e => setForm({ ...form, street: e.target.value })}
                placeholder="e.g. Street 4, Gulberg"
              />
            </div>

            {/* City dropdown shown for BOTH add and edit */}
            <div className="form-group">
              <label>City</label>
              <select
                value={form.city_id || ''}
                onChange={e => setForm({ ...form, city_id: e.target.value })}
              >
                <option value="">Select city</option>
                {cities.map(c => (
                  <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button
                className="btn btn-primary"
                style={{ width: 'auto' }}
                onClick={modal === 'add' ? handleAdd : handleUpdate}
              >
                {modal === 'add' ? 'Add Student' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  Delete confirmation */}
      {deleteId && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: 'white', marginBottom: '0.6rem', fontFamily: 'inherit', fontSize: '1.1rem' }}>
              Are you sure?
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.8rem', lineHeight: 1.5 }}>
              You're about to delete <strong style={{ color: 'white' }}>{deleteName}</strong>.
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" style={{ padding: '0.7rem 1.6rem' }} onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
