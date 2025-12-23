import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';


export default function SearchBar({ placeholder = 'Cari judul catatan…' }) {
    const [params, setParams] = useSearchParams();
    const [q, setQ] = useState(() => params.get('q') || '');

    useEffect(() => {
        if (q) setParams({ q });
        else setParams({});
        }, [q, setParams]
    );

    return (
        <input
            className="search"
            type="search"
            placeholder={placeholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Cari catatan berdasarkan judul"
        />
    );
}


SearchBar.propTypes = {
    placeholder: PropTypes.string,
};