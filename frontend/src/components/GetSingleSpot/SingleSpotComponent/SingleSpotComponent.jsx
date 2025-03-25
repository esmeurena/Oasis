import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './SingleSpotComponent.css';
import { useNavigate } from 'react-router-dom';
import { deleteReviewThunk, getAllReviewsThunk, postReviewThunk } from '../../../store/reviews';
import CreateReviewModal from '../CreateReviewModal/CreateReviewModal';

const SingleSpotComponent = ({ spot }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const reviews = useSelector((state) => state.reviews.allReviews);
    const currentUser = useSelector(state => state.session.user);

    const reviewArray = reviews.reviews || [];
    // const [review, setReview] = useState("");
    // const [stars, setStars] = useState(0);//("");

    const [addReviewModal, setAddReviewModal] = useState(false);
    // const [reviewDeleting, setReviewDeleting] = useState(null);

    useEffect(() => {

        if (spot) {
            dispatch(getAllReviewsThunk(spot.id));
        }

    }, [dispatch, spot]);

    const postReviewForm = () => {
        if (currentUser) {
            for (let review of reviewArray) {
                if (review.User.id === currentUser.id) {
                    return null;//break;
                }
            }
            setAddReviewModal(true);
        }
    };

    const addReviewToReviews = async (review, stars) => {

        const reviewData = { review, stars };
        await dispatch(postReviewThunk(spot.id, reviewData));//const spotWithNewReview =
        //console.log("SingleSPOT- reviewData ---", reviewData);
        //console.log("SingleSPOT- newwww ---", spotWithNewReview);
        
        setAddReviewModal(false);
        dispatch(getAllReviewsThunk(spot.id));//fetchOneSpotThunk(spot.id)));

        navigate(`/spots/${spot.id}`);//spotWithNewReview.spotId}`);


    };

    const deleteButtonClick = (review) => {
        // setReviewDeleting(review);
        dispatch(deleteReviewThunk(review.id));
        dispatch(getAllReviewsThunk(spot.id));
    };

    // const deleteReviewButton = async () => {
    //     await dispatch(deleteReviewThunk(reviewDeleting.id, spot.id));
    // };

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
                        currentUser && currentUser.id !== spot.Owner.id ? (
                            <p>Be the first to post a review!</p>
                        ) : currentUser && currentUser.id === spot.Owner.id ? (
                            <p>You cant review your own spot</p>
                        ) : (
                            <p>No reviews. Log in to post the first one!</p>
                        )
                    ) : (
                        reviewArray.map((review, idx) => {
                            let deleteButton = null;
                            if(currentUser && review.User.id === currentUser.id){
                                deleteButton = (
                                    <button onClick={() => deleteButtonClick(review)}>Delete</button>
                                );
                            }
                            return (
                                <div key={`${idx}-${review.id}`} className="review-card">
                                    <div className="review-align">
                                        <p>{review.User.firstName}</p>
                                        <div>★ {parseFloat(review.stars).toFixed(1)}</div>
                                    </div>
                                    <p className="cute-font">{review.review}</p>
                                    <p className="review-date">
                                        {new Date(review.createdAt).toLocaleString('en-US', {
                                            month: 'long', year: 'numeric',
                                        })}
                                    </p>
                                    {deleteButton}
                                </div>
                            );
                        })
                    )}
                </div>

                <div>
                    {(() => {
                        if(currentUser){
                            for(let review of reviewArray){
                                if(review.User.id === currentUser.id){
                                    return null;//break;
                                }
                            }
                            return <button onClick={postReviewForm}>Post Your Review</button>;

                        }
                    })()}
                </div>
                <CreateReviewModal
                    displayPopup={addReviewModal}
                    closePopup={() => setAddReviewModal(false)}
                    addReviewButton={addReviewToReviews}
                />
            </div>
        </div>
    );
}

export default SingleSpotComponent;