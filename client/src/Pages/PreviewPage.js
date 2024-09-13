import { useState, useEffect } from 'react';

function PreviewPage() {
  const [suggestions, setSuggestions] = useState([]);
  const googleColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#7200f4', '#0F9D58', '#db8837', '#883264', '#8ABBD0', '#dbb343', '#FF5864', '#82C6E2', '#FF7E29', '#A0E7E5', '#FFC2A1', '#FFD3B6', '#FFB7B2', '#FFD6E0', '#FFD7D7', '#FFD8B1', '#FFD180'];
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const response = await fetch('http://localhost:3030/preview', {
        credentials: 'include',
      });
      const data = await response.json();
      setSuggestions(data);
    };
    fetchSuggestions();
  }, []);

  const approveSuggestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:3030/approve/${id}`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to approve suggestion');
      }

      setSuggestions(suggestions.filter(s => s._id !== id));
    } catch (error) {
      console.error('Error approving suggestion:', error);
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

  const openModal = (suggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const closeModal = () => {
    setSelectedSuggestion(null);
  };

  return (
    <div className="suggestions-container">
      <h1 className='home-h1'>Onay Bekleyen Öneriler</h1>

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

              <div className="approval-buttons">
                <button className="approved-button" onClick={(e) => { e.stopPropagation(); approveSuggestion(suggestion._id); }}>
                  Onayla
                </button>
                <button className="deleted-button" onClick={(e) => { e.stopPropagation(); deleteSuggestion(suggestion._id); }}>
                  Sil
                </button>
              </div>
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

export default PreviewPage;
