import React from 'react';
import { useState, useEffect } from 'react';

const Alert = () => {
    const [allowGuestSuggestions, setAllowGuestSuggestions] = useState(true);

    useEffect(() => {
      const fetchSettings = async () => {
        const response = await fetch('http://localhost:3030/settings', {
          credentials: 'include',
        });
        const data = await response.json();
        setAllowGuestSuggestions(data.allowGuestSuggestions);
      };
      fetchSettings();
    }, []);

  return (
    <div className="Alert">
        <p className={allowGuestSuggestions ? 'GonderimAktif' : 'GonderimKapali'}>Öneri Gönderme Durumu: {allowGuestSuggestions ? 'Aktif' : 'Kapalı'}</p>
    </div>
  )
}

export default Alert