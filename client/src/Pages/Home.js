import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../Hooks/UserContext';

function Home() {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [sortingOption, setSortingOption] = useState('highestRated');
  const { userInfo } = useContext(UserContext);

  // Google renkleri
  const googleColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#7200f4', '#0F9D58', '#db8837', '#883264', '#8ABBD0', '#dbb343', '#FF5864', '#82C6E2', '#FF7E29', '#A0E7E5', '#FFC2A1', '#FFD3B6', '#FFB7B2', '#FFD6E0', '#FFD7D7', '#FFD8B1', '#FFD180'];

  useEffect(() => {
    const fetchSuggestions = async () => {
      const response = await fetch('http://localhost:3030/suggestions', {
        credentials: 'include',
      });
      let data = await response.json();
      data = sortNotes(data, sortingOption);

      setSuggestions(data);      
    };
    fetchSuggestions();
  }, []);

  const sortNotes = (data, option) => {
    switch (option) {
      case 'highestRated':
        return data.sort((a, b) => b.score - a.score);
      case 'newest':
        return data.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
      case 'oldest':
        return data.sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt));
      default:
        return data;
    }
  }

  const voteSuggestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:3030/vote/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userInfo?.username || 'Guest' }), // Kullanıcı adı veya 'Guest'
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const updatedSuggestion = await response.json();
      setSuggestions(suggestions.map(s => (s._id === id ? updatedSuggestion : s)));
    } catch (error) {
      console.error('Error voting on suggestion:', error);
    }
  };

  const deleteSuggestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:3030/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete suggestion');
      }

      setSuggestions(suggestions.filter(s => s._id !== id));
    } catch (error) {
      console.error('Error deleting suggestion:', error);
    }
  };

  const hasUserVoted = (suggestion) => {
    return suggestion.voters.includes(userInfo?.username || 'Guest');
  };

  const openModal = (suggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const closeModal = () => {
    setSelectedSuggestion(null);
  };

  const handleSortingChange = (e) => {
    setSortingOption(e.target.value);
    setSuggestions(sortNotes(suggestions, e.target.value));
  }

  const isAdmin = userInfo?.role === 'admin';

  return (
    <div className="suggestions-container">
      <h1 className='home-h1'>Öneriler</h1>

      <div className="sorting-options">
        <select title='sort' value={sortingOption} onChange={handleSortingChange}>
          <option className='highestRated' value="highestRated">En Yüksek Puan</option>
          <option className='newest' value="newest">En Yeni</option>
          <option className='oldest' value="oldest">En Eski</option>
        </select>
      </div>
      
      <div className="suggestions-grid">
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion._id}
            className="suggestion-card"
            style={{ backgroundColor: googleColors[index % googleColors.length] }}
            onClick={() => openModal(suggestion)}
          >
            <div className="suggestion-username">{suggestion.username}</div>
            <div className="suggestion-text">
              {suggestion.suggestion.slice(0, 128)}
              {suggestion.suggestion.length > 128 && '...'}
            </div>

            <div className="bottomArea">
              <span className="bottomAreaText">
                {suggestion.CreatedAt && new Date(suggestion.CreatedAt).toLocaleString()}
              </span>

              <div className="suggestion-vote">
                <button onClick={(e) => { e.stopPropagation(); voteSuggestion(suggestion._id); }}>
                  {hasUserVoted(suggestion) ? '🡻' : '🢁'}
                </button>
                <span>{suggestion.score}</span>
              </div>

              {isAdmin && (
                <button className="delete-button" onClick={(e) => { e.stopPropagation(); deleteSuggestion(suggestion._id); }}>
                  🗑
                </button>
              )}
            </div>

            


          </div>
        ))}
      </div>

      {selectedSuggestion && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedSuggestion.username} kullanıcısının Önerisi</h2>
            <div className="modal-suggestion-text">
              {selectedSuggestion.suggestion.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="bottomArea">
              <p className='TimeStamp'>
                {selectedSuggestion.CreatedAt && new Date(selectedSuggestion.CreatedAt).toLocaleString()}
              </p>
              <button onClick={closeModal}>Close</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
