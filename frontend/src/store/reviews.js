/**** IMPORTS ****/

import { csrfFetch } from './csrf';

/**** ACTION TYPES ****/

const GET_ALL_REVIEWS = "spots/getAllReviewsAction";
const POST_A_REVIEW = "spots/postReviewAction"
const DELETE_A_REVIEW = "spots/deleteReviewAction"

/**** ACTION CREATORS ****/

const getAllReviewsAction = (reviews) => {
  return {
    type: GET_ALL_REVIEWS,
    payload: reviews
  };
};

const postReviewAction = (review) => {
  return {
    type: POST_A_REVIEW,
    payload: review
  };
};

const deleteReviewAction = (review) => {
  return {
    type: DELETE_A_REVIEW,
    payload: review
  };
};

/**** THUNKS ****/

export const getAllReviewsThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${spotId}/reviews`);
  //console.log("FROM get All Revs::: ", response);
  const data = await response.json();
  //console.log("this is whats coming -- ", data);
  dispatch(getAllReviewsAction(data));
  return response;
};

export const postReviewThunk = (spotId, reviewInput) => async (dispatch) => {
  let { review, stars } = reviewInput;

  const response = await csrfFetch(`/api/reviews/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ review, stars })
  });
  const data = await response.json();
  dispatch(postReviewAction(data.review));
  return data;
};

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE"
  });

  if (response.ok) {
    //const data = await response.json();
    dispatch(deleteReviewAction(reviewId));
    //return data;
  }
}

/**** REDUCER ****/

const initialState = { allReviews: [] };//, revData: {avgReviews:0, totalReviews:0}}; //reviewsData: []

const reviewReducer = (state = initialState, action) => {
  let newState, newAllReviews = [], i = 0;

  switch (action.type) {

    case GET_ALL_REVIEWS:
      newState = { ...state };
      newState.allReviews = action.payload;
      //console.log("--- action.payload.Reviews ---", action.payload);
    //newState.revData = action.payload.reviewsData;
    //   for(let review of action.payload.Reviews){
    //     newById[review.id] = review
    //   }
      return newState;

    case POST_A_REVIEW:
      newState = { ...state };
      // newState.allReviews = action.payload;
      // newState.allReviews = [...newState.allReviews, action.payload];
      
      //action.payload = [];
      newState.allReviews = [];

      for (let review of newState.allReviews) {
        newState.allReviews[i] = review;
        i++;
      }

      //i++;
      newState.allReviews[i] = action.payload;
      
      return newState;

    case DELETE_A_REVIEW:
      //console.log("IN HERE FOR DELETE ACTION PAYLOAD---", action.payload);
      newState = { ...state };
      newState.allReviews = [];

      for(let review of newState.allReviews){
        if (review.id !== action.payload) {
          newAllReviews[i] = review;
          i++;
        }
      }
      newState.allReviews = newAllReviews;

      return newState;

    default:
      return state;
  }
};

export default reviewReducer;