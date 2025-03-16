/**** IMPORTS ****/

import { csrfFetch } from './csrf';

/**** ACTION TYPES ****/

const GET_ALL_SPOTS = "spots/getSpots";

/**** ACTION CREATORS ****/

const getSpots = (spots) => {
  //console.log("checking spots: ", spots);
    return {
      type: GET_ALL_SPOTS,
      payload: spots
    };
  };

/**** THUNKS ****/

  export const fetchAllSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots");
    const data = await response.json();
    //console.log("checking inside fetch: ", data.Spots);
    dispatch(getSpots(data.Spots));
    return response;
  };

/**** REDUCER ****/

const initialState = { Spots: [] };

const spotReducer = (state = initialState, action) => {
  //console.log("checking inside spotReducer: ", action.payload);
    switch (action.type) {
      case GET_ALL_SPOTS:
        return { ...state, Spots: action.payload };
      default:
        return state;
    }
  };

  export default spotReducer;