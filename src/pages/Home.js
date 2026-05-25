import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import GameCard from '../components/GameCard';
import api from '../api';

const ADMIN_PASSWORD = 'ogonx123';

function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const fetchGames = async () => {
    try {
      const res = await api.get('/api/Games');
      setGames(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const checkPassword = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
    }
  };

  const deleteGame = async (gameId) => {
    try {
      await api.delete(`/api/Games/${gameId}`);
      fetchGames();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {isAdmin && <SearchBar onGameImported={fetchGames} />}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="section-header">
            <p className="section-title">{games.length} games</p>
            {!isAdmin && (
              <div className="admin-gate">
                <input
                  className="form-input"
                  type="password"
                  placeholder="Admin password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && checkPassword()}
                  style={{ width: '160px', padding: '6px 12px', fontSize: '12px' }}
                />
                <button className="btn btn-secondary" onClick={checkPassword}>Unlock</button>
              </div>
            )}
          </div>

          {games.length === 0 ? (
            <div className="empty-state">No games yet</div>
          ) : (
            <div className="games-grid">
              {games.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  isAdmin={isAdmin}
                  onDelete={deleteGame}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;