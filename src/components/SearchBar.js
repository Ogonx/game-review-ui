import React, { useState } from 'react';
import api from '../api';

function SearchBar({ onGameImported }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/Rawg/search?query=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const importGame = async (rawgId) => {
    try {
      await api.post(`/api/Rawg/import/${rawgId}`);
      setResults([]);
      setQuery('');
      onGameImported();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search for a game..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <button className="btn btn-primary" onClick={search}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="search-results">
          {results.map(game => (
            <div key={game.id} className="search-result-item">
              <div className="search-result-info">
                {game.backgroundImage && (
                  <img src={game.backgroundImage} alt={game.name} className="search-result-img" />
                )}
                <div>
                  <div className="search-result-name">{game.name}</div>
                  <div className="search-result-meta">
                    {game.genres?.map(g => g.name).join(', ')}
                  </div>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => importGame(game.id)}>
                Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;