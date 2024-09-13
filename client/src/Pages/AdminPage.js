import { useState, useEffect } from 'react';

function AdminPage() {
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

  const toggleGuestSuggestions = async () => {
    try {
      const response = await fetch('http://localhost:3030/toggle-guest-suggestions', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle guest suggestions');
      }

      const data = await response.json();
      setAllowGuestSuggestions(data.allowGuestSuggestions);
    } catch (error) {
      console.error('Error toggling guest suggestions:', error);
    }
  };

  return (
    <div className='AdminPage'>
      <h1>Admin Page</h1>
      <p className={allowGuestSuggestions ? 'true' : 'false'}>Öneri Gönderme Durumu: {allowGuestSuggestions ? 'Enabled' : 'Disabled'}</p>
      <button onClick={toggleGuestSuggestions} className={allowGuestSuggestions ? 'ButtonFalse' : 'ButtonTrue'}>
        Öneri Gönderme Durumunu Değiştir: {allowGuestSuggestions ? 'Disable' : 'Enable'}
      </button>
    </div>
  );
}

export default AdminPage;