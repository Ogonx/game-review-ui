import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import api from '../api';

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [averageScore, setAverageScore] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGame = async () => {
    try {
      const [gameRes, scoreRes] = await Promise.all([
        api.get(`/api/Games/${id}`),
        api.get(`/api/Games/${id}/averagescore`)
      ]);
      setGame(gameRes.data);
      setAverageScore(scoreRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGame();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!game) return <div className="empty-state">Game not found</div>;

  return (
    <div>
      <Link to="/" className="back-link">← Back</Link>

      <div className="game-details-header">
        {game.backgroundImage ? (
          <img src={game.backgroundImage} alt={game.name} className="game-details-img" />
        ) : (
          <div className="game-details-img" />
        )}
        <div className="game-details-info">
          <h1 className="game-details-title">{game.name}</h1>
          <p className="game-details-meta">🎮 {game.platforms}</p>
          <p className="game-details-meta">🏷️ {game.genres}</p>
          {averageScore && (
            <div className="game-details-score">
              <span className="score-number">
                {averageScore.totalReviews > 0 ? averageScore.averageScore : '—'}
              </span>
              <div>
                <div className="score-label">Average Score</div>
                <div className="score-label">{averageScore.totalReviews} reviews</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <p className="section-title">Reviews</p>
        <ReviewForm gameId={parseInt(id)} onReviewAdded={fetchGame} />

        {game.reviews?.length === 0 ? (
          <div className="empty-state">No reviews yet — be the first</div>
        ) : (
          game.reviews?.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="review-author">{review.author}</span>
                <span className="review-score">{review.score}/10</span>
              </div>
              <p className="review-content">{review.content}</p>
              <p className="review-date">
                {new Date(review.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GameDetails;