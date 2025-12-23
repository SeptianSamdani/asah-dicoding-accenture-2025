import React, { createContext, useCallback, useMemo, useState, useEffect } from 'react';

export const LocaleContext = createContext(null);

export default function LocaleProvider({ children }) {
    const [locale, setLocale] = useState(() => localStorage.getItem('locale') || 'id');
    useEffect(() => { 
        localStorage.setItem('locale', locale); }, [locale]
    );
    const toggleLocale = useCallback(() => setLocale(l => (l === 'id' ? 'en' : 'id')), []);
    const t = useMemo(() => (key) => {
    const dict = {
        id: { active: 'Catatan Aktif', archive: 'Arsip Catatan', login: 'Masuk', logout: 'Keluar', search:'Cari judul…', add:'Tambah' },
        en: { active: 'Active Notes', archive: 'Archived Notes', login: 'Login', logout: 'Logout', search:'Search titles…', add:'Add' },
    };

    return dict[locale][key] ?? key;
    }, [locale]);

    return <LocaleContext.Provider value={{ locale, toggleLocale, t }}>
            {children}
        </LocaleContext.Provider>;
}
