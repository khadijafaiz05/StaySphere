import { useEffect, useState } from 'react';

const API = 'http://localhost:3000/api';

const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('ss_token')}`
});

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState({});
  const [alert,    setAlert]    = useState(null);

  const load = async () => {
    try {
      const res  = await fetch(`${API}/students`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load students');
      setStudents(data);
    } catch (e) {
      showAlert(e.message, 'error');
    }
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
      const res  = await fetch(`${API}/students`, {
        method:  'POST',
        headers: authHeader(),
        body:    JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add student');
      setModal(null); setForm({});
      showAlert('Student added successfully');
      load();
    } catch (e) { showAlert(e.message, 'error'); }
  };

  const handleUpdate = async () => {
    try {
      const res  = await fetch(`${API}/students/${form.student_id}`, {
        method:  'PUT',
        headers: authHeader(),
        body:    JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update student');
      setModal(null); setForm({});
      showAlert('Student updated');
      load();
    } catch (e) { showAlert(e.message, 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      const res  = await fetch(`${API}/students/${id}`, {
        method:  'DELETE',
        headers: authHeader()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete student');
      showAlert('Student removed');
      load();
    } catch (e) { showAlert(e.message, 'error'); }
  };

  const totalFees = students.reduce((a, s) => a + Number(s.total_fees || 0), 0);
  const totalPaid = students.reduce((a, s) => a + Number(s.total_paid || 0), 0);
  const pct = totalFees ? Math.round(totalPaid / totalFees * 100) : 0;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Student Management</h2>

      {alert && (
        <p style={{ color: alert.type === 'error' ? 'red' : 'green' }}>
          {alert.msg}
        </p>
      )}

      <div style={{ marginBottom: '20px' }}>
        <p>Total Students: <b>{students.length}</b></p>
        <p>Rooms Assigned: <b>{students.filter(s => s.room_number).length}</b></p>
        <p>Total Fees: <b>₨{totalFees.toLocaleString()}</b> | Paid: <b>₨{totalPaid.toLocaleString()}</b> ({pct}%)</p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <input
          placeholder="Search by name or username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '6px 10px', width: '260px' }}
        />
        {' '}
        <button onClick={() => { setForm({}); setModal('add'); }}>
          + Add Student
        </button>
      </div>

      <table border="1" cellPadding="10" style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Room</th>
            <th>Street</th>
            <th>Total Fees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.student_id}>
              <td>{s.student_id}</td>
              <td>{s.name}</td>
              <td>{s.username}</td>
              <td>{s.phone || '—'}</td>
              <td>{s.room_number || 'Unassigned'}</td>
              <td>{s.street || '—'}</td>
              <td>₨{Number(s.total_fees || 0).toLocaleString()}</td>
              <td>
                <button onClick={() => { setForm(s); setModal('edit'); }}>Edit</button>
                {' '}
                <button onClick={() => handleDelete(s.student_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
          onClick={e => e.target === e.currentTarget && setModal(null)}
        >
          <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <h3>{modal === 'add' ? 'Add New Student' : 'Edit Student'}</h3>

            <br />

            <div>
              <label>Full Name</label><br />
              <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <br />

            {modal === 'add' && (
              <>
                <div>
                  <label>Username</label><br />
                  <input value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })} />
                </div>
                <br />
                <div>
                  <label>Password</label><br />
                  <input type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
                <br />
              </>
            )}

            <div>
              <label>Phone</label><br />
              <input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>

            <br />

            <div>
              <label>Street</label><br />
              <input value={form.street || ''} onChange={e => setForm({ ...form, street: e.target.value })} />
            </div>

            <br />

            <button onClick={() => setModal(null)}>Cancel</button>
            {' '}
            <button onClick={modal === 'add' ? handleAdd : handleUpdate}>
              {modal === 'add' ? 'Add Student' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}