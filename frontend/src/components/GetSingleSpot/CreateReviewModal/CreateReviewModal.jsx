import { useState } from 'react';

import './CreateReviewModal.css';

const CreateReviewModal = ({ displayPopup, closePopup, addReviewButton }) => {
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);

  const resetDataAndClose = () => {

    setReview('');
    setStars(0);

    closePopup();
  };

  const [validate, setValidate] = useState({});

  const validations = () => {
    const displayValidation = {};

    if(!review || review.length < 10 || review.length < 1){
      displayValidation.review = "Review is empty or must be over 10 characters";
    } else {
      delete displayValidation.review;
    }

    if(!stars || stars < 1 || stars > 5){
      displayValidation.stars = "Stars are empty or must be between 1 and 5";
    } else {
      delete displayValidation.stars;
    }

    let noError = true;
    for(let validationMessage of Object.values(displayValidation)){
      if(validationMessage){
        noError = false;
        break; 
      }
    }

    setValidate(displayValidation);
    return noError;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    //addReviewButton(review, stars);
    const isValid = validations();

    if(!isValid){
      return;
    }

    const newSpot = addReviewButton(review, stars);
    closePopup();
    navigate(`/spots/${newSpot.id}`);

    // console.log("INSIDEEEEE cerateModal");
    // setReview('');
    // setStars(0);
  };

  if (!displayPopup) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>How was your stay?</h3>
        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => {
            const value = e.target.value;
            setReview(value);
            validations();
          }}
          required
        />
        {(() => {
          if (validate.review) {
            return <div> {validate.review} </div>;
          }
        })()}
        <div>
          <label>Stars</label>
          <input
            type="number"
            value={stars}
            onChange={(e) => {
              const value = e.target.value;
              setStars(value);
              validations();
            }}
            required
          min={1}
          max={5}
          />
          {(() => {
            if (validate.stars) {
              return <div> {validate.stars} </div>;
            }
          })()}
        </div>
        <button
          onClick={handleSubmit}
          // disabled={review.length < 10 || stars < 1 || stars > 5}
        >
          Submit Your Review
        </button>
        <button onClick={resetDataAndClose}>Close</button>
      </div>
    </div>
  );
};

export default CreateReviewModal;
