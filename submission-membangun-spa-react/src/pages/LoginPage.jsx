import React, { useContext, useState } from 'react';
import useInput from '../hooks/useInput.js';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader.jsx';

export default function LoginPage() {
  const { login, loading, user } = useContext(AuthContext);
  const [email, onEmail] = useInput('');
  const [password, onPassword] = useInput('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (loading) return <Loader />;
  if (user) { navigate('/'); return null; }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login({ email, password });
    setSubmitting(false);
    if (ok) navigate('/');
  };

  return (
    <section>
      <h1>Masuk</h1>
      <form className="note-form" onSubmit={onSubmit}>
        <label>Email<input type="email" value={email} onChange={onEmail} required /></label>
        <label>Password<input type="password" value={password} onChange={onPassword} required /></label>
        <div className="form-actions">
          <button className="primary" disabled={submitting}>{submitting ? 'Memproses…' : 'Masuk'}</button>
        </div>
      </form>
      <p>Belum punya akun? <Link to="/register">Daftar</Link></p>
    </section>
  );
}
