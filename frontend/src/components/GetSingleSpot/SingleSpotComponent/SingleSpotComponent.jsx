import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './SingleSpotComponent.css';
import { getAllReviewsThunk } from '../../../store/reviews';

const SingleSpotComponent = ({ spot }) => {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.reviews.allReviews);
    //console.log("SINGLESPOT - reviews", reviews);
    //const reviewDatas = useSelector((state) => state.reviews.reviewsData);
    //console.log("SINGLESPOT - reviewsDATA", reviewDatas);
    const reviewArray = reviews.reviews || [];

    useEffect(() => {

        if (spot) {
            dispatch(getAllReviewsThunk(spot.id));
        }

    }, [dispatch, spot]);


    return (
        <div>
            <h2 className="cute-font-title">{spot.name}</h2>
            <div>
                <div className="location-review">
                    <p className="cute-font-text">{spot.city}, {spot.state}, {spot.country}</p>
                    {/* <p className="cute-font-text">{spot.aveReview}</p> */}
                    <div>
                        {(() => {//if(spot.aveReview) <= 0){
                            if (parseFloat(spot.aveReview) <= 0) {
                                return (
                                    <p className="cute-font-text">★ New</p>
                                )
                            } else if (parseFloat(spot.aveReview) > 0 && reviewArray.length === 1) {
                                return (
                                    <div className="side-by-side">
                                        <p className="cute-font-text">{reviewArray.length} Review • </p>
                                        <p className="cute-font-text">★ {parseFloat(spot.aveReview).toFixed(1)}</p>
                                    </div>
                                )
                            } else if (parseFloat(spot.aveReview) > 0 && reviewArray.length > 1) {
                                return (
                                    <div className="side-by-side">
                                        <p className="cute-font-text">{reviewArray.length} Reviews • </p>
                                        <p className="cute-font-text">★ {parseFloat(spot.aveReview).toFixed(1)}</p>
                                    </div>
                                )
                            }
                        })()}
                    </div>
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
                <h2 className="cute-font">Reviews</h2>
                <div>
                    {reviewArray.length === 0 ? (
                        <p>Be the first to post a review!</p>
                    ) : (
                        reviewArray.map((review, idx) => (
                            <div key={`${idx}-${review.id}`} className="review-card">
                                <div className="review-align">
                                    <p>{review.User.firstName}</p>
                                    <div>
                                        {/* {review.stars} */}
                                        ★ {parseFloat(review.stars).toFixed(1)}
                                    </div>
                                </div>
                                <p className="cute-font">{review.review}</p>
                                {/* <p>{review.createdAt}</p> <p className="review-date">{new Date(review.createdAt).toLocaleString('en-US')}</p>*/}
                                <p className="review-date">{new Date(review.createdAt).toLocaleString('en-US', {
                                    month: 'long', year: 'numeric',
                                })}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="reserve-box">
                    <p className="cute-font-text">{spot.price} / night</p>
                    <button className="cute-font-text" onClick={() => alert('Feature coming soon!!')}>Reserve!!</button>
                </div>
            </div>
        </div>
    );
}

export default SingleSpotComponent;