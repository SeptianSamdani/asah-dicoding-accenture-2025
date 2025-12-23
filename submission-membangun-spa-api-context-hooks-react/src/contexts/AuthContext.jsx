import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getAccessToken, putAccessToken, getUserLogged, login as loginApi, register as registerApi } from '../utils/network-data.js';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);         // null = belum login / tidak valid
  const [loading, setLoading] = useState(true);   // loading bootstrap auth
  const [error, setError] = useState(null);

  // bootstrap: cek token -> fetch user
  useEffect(() => {
    (async () => {
      try {
        const token = getAccessToken();
        if (!token) { setLoading(false); return; }
        const { error, data } = await getUserLogged();
        if (!error) setUser(data);

        const ok = await loginApi({ email, password });
        if (!ok.error) {
          putAccessToken(ok.data.accessToken);
          const prof = await getUserLogged();   // ambil /users/me
          if (!prof.error) setUser(prof.data);  // simpan di state
        }

      } finally {
        setLoading(false);
      }
    })();
  }, []);

  

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    const { error, data } = await loginApi({ email, password });
    if (error) { setError('Login gagal'); return false; }
    putAccessToken(data.accessToken);
    const prof = await getUserLogged();
    if (!prof.error) setUser(prof.data);
    return true;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    setError(null);
    const { error } = await registerApi({ name, email, password });
    if (error) { setError('Registrasi gagal'); return false; }
    return true;
  }, []);

  const logout = useCallback(() => {
    putAccessToken('');
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, error, login, register, logout }), [user, loading, error, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
