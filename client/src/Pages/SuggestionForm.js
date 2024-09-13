import { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';

function SuggestionForm() {
  const [suggestion, setSuggestion] = useState('');
  const [guestUsername, setGuestUsername] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { userInfo } = useContext(UserContext);
  const username = userInfo?.username || guestUsername;

  const submitSuggestion = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch('http://localhost:3030/suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          suggestion,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to submit suggestion');
      }

      const result = await response.json();
      console.log(result);
      setRedirect(true);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form className='eklemeForm' onSubmit={submitSuggestion}>
      {username !== userInfo.username && (
        <div>
          <label className='eklemeUsername' htmlFor="guestUsername">Kullanıcı Adı:</label>
          <input
            type="text"
            id="guestUsername"
            value={guestUsername}
            onChange={(e) => setGuestUsername(e.target.value)}
            placeholder="Kullanıcı adınızı girin"
            required
          />
        </div>
      )}
      <div>
        <label htmlFor="suggestion">Öneri:</label>
        <textarea
          id="suggestion"
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          placeholder="Önerinizi girin"
          required
        />
      </div>
      <button type="submit">Onayla</button>
    </form>
  );
}

export default SuggestionForm;
