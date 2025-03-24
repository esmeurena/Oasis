// import React from 'react';
import './SpotsComponent.css';

const SpotsComponent = ({ spot }) => {
    return (
        <div className="spot-container">
            <div className="individual-spot-list">
                {spot.previewImage && (
                    <img src={spot.previewImage} className="spot-image" />
                )}
                <div className="avg-rating">
                    {/* <h2 className="cute-font-title">{spot.name}</h2> */}
                    <h3 className="cute-font-title">{spot.city}, {spot.state}</h3>
                    {(() => {//if(spot.aveReview) <= 0){
                        if(parseFloat(spot.aveReview) <= 0){
                            return (
                                <p className="cute-font-text">★ New</p>
                            )
                        } else if(parseFloat(spot.aveReview) > 0){
                            return (
                                <p className="cute-font-text">★ {parseFloat(spot.aveReview).toFixed(1)}</p>
                            )
                        }
                    })()}
                </div>

                <p className="cute-font-text">{spot.description}</p>
                {/* <p className="cute-font-text">{spot.city}, {spot.state}</p> */}
                <p className="cute-font-text">{spot.price} / night </p>

                <div className="tooltip">
                    {spot.name}
                </div>

            </div>
        </div>
    );
}

export default SpotsComponent;