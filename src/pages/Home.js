import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import GameCard from '../components/GameCard';
import api from '../api';

function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <SearchBar onGameImported={fetchGames} />
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : games.length === 0 ? (
        <div className="empty-state">
          No games yet — search for one above to get started
        </div>
      ) : (
        <>
          <p className="section-title">{games.length} games</p>
          <div className="games-grid">
            {games.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;