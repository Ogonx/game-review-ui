import React from 'react';
import { Link } from 'react-router-dom';

function GameCard({ game, isAdmin, onDelete }) {
  const avgScore = game.reviews?.length > 0
    ? (game.reviews.reduce((a, b) => a + b.score, 0) / game.reviews.length).toFixed(1)
    : null;

  return (
    <div className="game-card-wrapper" style={{ position: 'relative' }}>
      <Link to={`/game/${game.id}`} className="game-card">
        {game.backgroundImage ? (
          <img src={game.backgroundImage} alt={game.name} className="game-card-img" />
        ) : (
          <div className="game-card-img" />
        )}
        <div className="game-card-info">
          <div className="game-card-title">{game.name}</div>
          <div className="game-card-meta">
            <span className="game-card-score">
              {avgScore ? avgScore : 'No reviews'}
            </span>
            <span className="game-card-reviews">
              {game.reviews?.length} {game.reviews?.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>
      </Link>
      {isAdmin && (
        <button
          className="btn btn-ghost"
          onClick={(e) => {
            e.preventDefault();
            onDelete(game.id);
          }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: '#00000088',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}

export default GameCard;