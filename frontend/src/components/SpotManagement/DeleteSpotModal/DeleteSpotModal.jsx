import { useNavigate } from 'react-router-dom';
import './DeleteSpotModal.css';
import { deleteSpotThunk } from '../../../store/spots';
import { useDispatch } from 'react-redux';

const DeleteSpotModal = ({ displayDeletePopup, closePopup, spotId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const yesAndClosePopup = (e) => {
    e.preventDefault();
    dispatch(deleteSpotThunk(spotId));

    navigate('/spots/spotManagement');
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
            <p>Are you sure you want to remove this spot?</p>
            <div>
              <button className="red-button-yes"
                onClick={yesAndClosePopup}> Yes (Delete Spot)
              </button>
              <button className="gray-button-no" onClick={noAndClosePopup}>No (Keep Spot)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteSpotModal;
