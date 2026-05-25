import React, { useState } from 'react';
import api from '../api';

function ReviewForm({ gameId, onReviewAdded }) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!author.trim() || !content.trim() || !score) return;
    if (score < 1 || score > 10) return;
    setLoading(true);
    try {
      await api.post('/api/Reviews', {
        gameId,
        author,
        content,
        score: parseInt(score)
      });
      setAuthor('');
      setContent('');
      setScore('');
      onReviewAdded();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="review-form">
      <h3>Write a Review</h3>
      <div className="form-row">
        <div className="form-group" style={{ flex: 2 }}>
          <input
            className="form-input"
            type="text"
            placeholder="Your name"
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <input
            className="form-input"
            type="number"
            placeholder="Score (1-10)"
            min="1"
            max="10"
            value={score}
            onChange={e => setScore(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <textarea
          className="form-input form-textarea"
          placeholder="What did you think?"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={submit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
}

export default ReviewForm;