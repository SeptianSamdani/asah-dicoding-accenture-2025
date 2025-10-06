import React, { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import DetailPage from './pages/DetailPage.jsx';
import NewNotePage from './pages/NewNotePage.jsx';
import ArchivePage from './pages/ArchivePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthProvider, { AuthContext } from './contexts/AuthContext.jsx';
import ThemeProvider, { ThemeContext } from './contexts/ThemeContext.jsx';
import LocaleProvider, { LocaleContext } from './contexts/LocaleContext.jsx'; // opsional

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { toggleTheme } = useContext(ThemeContext);
  const { t, toggleLocale } = useContext(LocaleContext); // opsional

  return (
    <header className="site-header">
      <Link to="/" className="brand">🗒️ Notes</Link>
      <nav className="nav">
        {user && <Link to="/archive">{t('archive')}</Link>}
        {user && <Link to="/notes/new" className="primary">{t('add')}</Link>}
        <button className="ghost" onClick={toggleTheme}>Tema</button>
        <button className="ghost" onClick={toggleLocale}>Lang</button>
        {user ? <button onClick={logout}>Logout</button> : <Link to="/login">{t('login')}</Link>}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <div className="container">
            <Header />
            <main className="site-main">
              <Routes>
                {/* publik */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* privat (proteksi) */}
                <Route index element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/archive" element={<ProtectedRoute><ArchivePage /></ProtectedRoute>} />
                <Route path="/notes/new" element={<ProtectedRoute><NewNotePage /></ProtectedRoute>} />
                <Route path="/notes/:id" element={<ProtectedRoute><DetailPage /></ProtectedRoute>} />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <footer className="site-footer">© {new Date().getFullYear()} Notes App</footer>
          </div>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
