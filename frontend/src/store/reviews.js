/**** IMPORTS ****/

import { csrfFetch } from './csrf';

/**** ACTION TYPES ****/

const GET_ALL_REVIEWS = "spots/getAllReviewsAction";

/**** ACTION CREATORS ****/

const getAllReviewsAction = (reviews) => {
  return {
    type: GET_ALL_REVIEWS,
    payload: reviews
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

/**** REDUCER ****/

const initialState = { allReviews: [] };//, revData: {avgReviews:0, totalReviews:0}}; //reviewsData: []

const reviewReducer = (state = initialState, action) => {
  let newState;

  switch (action.type) {

    case GET_ALL_REVIEWS:
    //   console.log("actionnnnn ----", action.payload);
    //   console.log("actionnnnn ----", action.payload.reviews);
    //   console.log("actionnnnn ----", action.payload.reviewsData);
      newState = { ...state };
      newState.allReviews = action.payload;
      //console.log("--- action.payload.Reviews ---", action.payload);
    //newState.revData = action.payload.reviewsData;
    //   for(let review of action.payload.Reviews){
    //     newById[review.id] = review
    //   }
      return newState;

    default:
      return state;
  }
};

export default reviewReducer;