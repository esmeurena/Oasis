import './SingleSpotComponent.css';

const SingleSpotComponent = ({ spot }) => {
    return (
        <div>
            <h2 className="cute-font-title">{spot.name}</h2>
            <div>
                <div className="location-review">
                    <p className="cute-font-text">{spot.city}, {spot.state}, {spot.country}</p>
                    <p className="cute-font-text">{spot.aveReview}</p>
                </div>
                <div className="all-images">
                    <div className="main-image">
                        <img src={spot.previewImage} className="get-spot-image" />
                    </div>
                    <div className="small-images">
                        <img src={spot.previewImage} className="smaller-image" />
                        <img src={spot.previewImage} className="smaller-image" />
                        <img src={spot.previewImage} className="smaller-image" />
                        <img src={spot.previewImage} className="smaller-image" />
                    </div>
                </div>
                {<p>Hosted by {spot.Owner.firstName}, {spot.Owner.lastName}</p>}
                <p className="cute-font-text">{spot.description}</p>
                <div className="reserve-box">
                    <p className="cute-font-text">{spot.price} / night</p>
                    <button className="cute-font-text" onClick={() => alert('Feature coming soon!!')}>Reserve!!</button>
                </div>
            </div>
        </div>
    );
}

export default SingleSpotComponent;