// import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './CurrentSpotsComponent.css';

const CurrentSpotsComponent = ({ spot, deleteSpot }) => {
    const [confirmDeletePopup, setConfirmDeletePopup] = useState(false);
    //console.log("Wwhats in this ----", confirmDeletePopup);
    const openDeletePopup = () => setConfirmDeletePopup(true);
    const closeDeletePopup = () => setConfirmDeletePopup(false);

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
                    <div>
                        <Link to={`/spots/${spot.id}/update`} >Update Spot</Link>
                    </div>
                    <div>
                        <button onClick={openDeletePopup}>Delete Spot</button>
                    </div>

                    {confirmDeletePopup && (
                        <div>
                            <div>
                                <h1>Confirm Delete</h1>
                                <p>Are you sure you want to remove this spot?</p>
                                <div>
                                    <button className="red-button-yes"
                                        onClick={() => {
                                            deleteSpot(spot.id);
                                            closeDeletePopup();
                                        }}> Yes (Delete Spot)
                                    </button>
                                    <button className="gray-button-no" onClick={closeDeletePopup}>No (Keep Spot)</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="cute-font-text">{spot.price} / night </p>

                    <div className="tooltip">
                        {spot.name}
                    </div>

                </div>
            </Link>
        </div>
    );
}

export default CurrentSpotsComponent;