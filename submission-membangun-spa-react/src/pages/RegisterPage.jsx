import React, { useContext, useState } from 'react';
import useInput from '../hooks/useInput.js';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const { register, user } = useContext(AuthContext);
  const [name, onName] = useInput('');
  const [email, onEmail] = useInput('');
  const [password, onPassword] = useInput('');
  const [confirm, onConfirm] = useInput('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (user) { navigate('/'); return null; }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { alert('Konfirmasi password tidak cocok'); return; }
    setSubmitting(true);
    const ok = await register({ name, email, password });
    setSubmitting(false);
    if (ok) navigate('/login');
  };

  return (
    <section>
      <h1>Registrasi</h1>
      <form className="note-form" onSubmit={onSubmit}>
        <label>Nama<input value={name} onChange={onName} required /></label>
        <label>Email<input type="email" value={email} onChange={onEmail} required /></label>
        <label>Password<input type="password" value={password} onChange={onPassword} required /></label>
        <label>Konfirmasi Password<input type="password" value={confirm} onChange={onConfirm} required /></label>
        <div className="form-actions">
          <button className="primary" disabled={submitting}>{submitting ? 'Memproses…' : 'Daftar'}</button>
        </div>
      </form>
      <p>Sudah punya akun? <Link to="/login">Masuk</Link></p>
    </section>
  );
}
