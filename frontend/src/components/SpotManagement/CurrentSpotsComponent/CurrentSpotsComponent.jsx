// import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './CurrentSpotsComponent.css';
import { useNavigate } from 'react-router-dom';
// import { deleteSpotThunk } from '../../../store/spots';
import DeleteSpotModal from '../DeleteSpotModal';

const CurrentSpotsComponent = ({ spot }) => {
    // const dispatch = useDispatch();

    const currentUser = useSelector(state => state.session.user);
    const [deleteSpotPopup, setDeleteSpotPopup] = useState(false);
    //const openDeletePopup = () => setDeleteSpotPopup(true);
    //const closeDeletePopup = () => setDeleteSpotPopup(false);
    const navigate = useNavigate();

    // const deleteTheSpot = async () => {
    //     //e.preventDefault();
    //     console.log("INSIDE DELETE A SPOT");
    //     await dispatch(deleteSpotThunk(spot.id));

    //     navigate('/');
    // };

    const verifyUserToDeleteSpot = () => {
        if (currentUser && (spot.Owner.id === currentUser.id)) {
            setDeleteSpotPopup(true);
        }
    }

    const updateSpotLink = async () => {
        navigate(`/spots/${spot.id}/update`);
    }

    return (
        <div>
            <Link to={`/spots/${spot.id}`} className="spot-container">
                <div className="individual-spot-list">
                    {spot.previewImage && (
                        <img src={spot.previewImage} className="spot-image" />
                    )}
                    <div className="avg-rating">
                        <h2 className="cute-font-title">{spot.name}</h2>
                        {(() => {//if(spot.aveReview) <= 0){
                            if (parseFloat(spot.aveReview) <= 0) {
                                return (
                                    <p className="cute-font-text">★ New</p>
                                )
                            } else if (parseFloat(spot.aveReview) > 0) {
                                return (
                                    <p className="cute-font-text">★ {parseFloat(spot.aveReview).toFixed(1)}</p>
                                )
                            }
                        })()}
                    </div>

                    <p className="cute-font-text">{spot.description}</p>
                    <p className="cute-font-text">{spot.city}, {spot.state}</p>
                    <p className="cute-font-text">{spot.price} / night </p>

                    <div className="tooltip">
                        {spot.name}
                    </div>
                </div>
            </Link>
            <div>
                <button className="cute-font-button"
                    onClick={updateSpotLink}>Update Spot
                </button>
                <button className="cute-font-button" onClick={verifyUserToDeleteSpot}>Delete Spot</button>
            </div>

            <DeleteSpotModal
                displayDeletePopup={deleteSpotPopup}
                closePopup={() => setDeleteSpotPopup(false)}
                //deleteSpotButton={deleteTheSpot}
                spotId={spot.id}
            />
        </div>
    );
}

export default CurrentSpotsComponent;