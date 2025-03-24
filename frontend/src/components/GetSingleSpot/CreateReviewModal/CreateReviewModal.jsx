import React, { useState } from 'react';

import './CreateReviewModal.css';

const CreateReviewModal = ({ displayPopup, closePopup, addReviewButton }) => {
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    addReviewButton(review, stars);

    // console.log("INSIDEEEEE cerateModal");
    // setReview('');
    // setStars(0);

    closePopup();
  };
  const resetDataAndClose = () => {

    setReview('');
    setStars(0);

    closePopup();
  };

  if (!displayPopup) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>How was your stay?</h3>
        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div>
          <label>Stars</label>
          <input
            type="number"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            min={1}
            max={5}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={review.length < 10 || stars < 1 || stars > 5}
        >
          Submit Your Review
        </button>
        <button onClick={resetDataAndClose}>Close</button>
      </div>
    </div>
  );
};

export default CreateReviewModal;
