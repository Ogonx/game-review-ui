import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import api from '../api';

const ADMIN_PASSWORD = 'ogonx123';

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [averageScore, setAverageScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchGame();
  }, [id]);

  const deleteReview = async (reviewId) => {
    try {
      await api.delete(`/api/Reviews/${reviewId}`);
      fetchGame();
    } catch (err) {
      console.error(err);
    }
  };

  const checkPassword = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
    }
  };

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
          <div className="game-details-tags">
            {game.platforms?.split(',').map((p, i) => (
              <span key={i} className="tag">{p.trim()}</span>
            ))}
            {game.genres?.split(',').map((g, i) => (
              <span key={i} className="tag">{g.trim()}</span>
            ))}
          </div>
          {averageScore && averageScore.totalReviews > 0 && (
            <div className="game-details-score">
              <span className="score-number">{averageScore.averageScore}</span>
              <span className="score-meta">{averageScore.totalReviews} reviews</span>
            </div>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <div className="section-header">
          <p className="section-title">Reviews</p>
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

        {isAdmin && <ReviewForm gameId={parseInt(id)} onReviewAdded={fetchGame} />}

        {game.reviews?.length === 0 ? (
          <div className="empty-state">No reviews yet</div>
        ) : (
          game.reviews?.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-header-left">
                  <span className="review-author">{review.author}</span>
                  <span className="review-score">{review.score}/10</span>
                </div>
                {isAdmin && (
                  <button className="btn btn-ghost" onClick={() => deleteReview(review.id)}>
                    Delete
                  </button>
                )}
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