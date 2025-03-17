/**** IMPORTS ****/

import { csrfFetch } from './csrf';

/**** ACTION TYPES ****/

const GET_ALL_SPOTS = "spots/getSpots";
const GET_A_SPOT = "spots/getSpot";

/**** ACTION CREATORS ****/

const getSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    payload: spots
  };
};

const getSpot = (spot) => {
  return {
    type: GET_A_SPOT,
    payload: spot
  };
};

/**** THUNKS ****/

  export const fetchAllSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots");
    const data = await response.json();
    dispatch(getSpots(data.Spots));
    return response;
  };

  export const fetchOneSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    //console.log(response);
    const data = await response.json();
    //console.log("fetchOneSpot-- ", data)
    dispatch(getSpot(data));
    return response;
  };

/**** REDUCER ****/

const initialState = { Spots: [], Spot: null };

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS:
      return { ...state, Spots: action.payload };
    case GET_A_SPOT:
      return { ...state, Spot: action.payload };
    default:
      return state;
  }
};

export default spotReducer;