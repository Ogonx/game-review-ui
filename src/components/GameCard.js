import React from 'react';
import { Link } from 'react-router-dom';

function GameCard({ game }) {
  return (
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
            {game.reviews?.length > 0
              ? `★ ${(game.reviews.reduce((a, b) => a + b.score, 0) / game.reviews.length).toFixed(1)}`
              : 'No reviews'}
          </span>
          <span className="game-card-reviews">
            {game.reviews?.length} {game.reviews?.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default GameCard;