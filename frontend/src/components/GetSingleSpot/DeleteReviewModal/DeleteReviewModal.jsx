import { useNavigate } from 'react-router-dom';
import './DeleteReviewModal.css';
import { useDispatch } from 'react-redux';
import { deleteReviewThunk, getAllReviewsThunk } from '../../../store/reviews';

const DeleteReviewModal = ({ displayDeletePopup, closePopup, spotId, reviewId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const yesAndClosePopup = (e) => {
    e.preventDefault();
    dispatch(deleteReviewThunk(reviewId));
    dispatch(getAllReviewsThunk(spotId));

    navigate(`/spots/${spotId}`);
    closePopup();
  };

  const noAndClosePopup = () => {closePopup();};

  if (!displayDeletePopup) return null;

  return (
    <div>
      {displayDeletePopup && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this review?</p>
            <div>
              <button className="red-button-yes"
                onClick={yesAndClosePopup}> Yes (Delete Review)
              </button>
              <button className="gray-button-no" onClick={noAndClosePopup}>No (Keep Review)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteReviewModal;
