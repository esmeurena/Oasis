/**** IMPORTS ****/

import { csrfFetch } from './csrf';

/**** ACTION TYPES ****/

const GET_ALL_SPOTS = "spots/getSpots";
const GET_A_SPOT = "spots/getSpot";
const POST_A_SPOT = "spots/createSpot"

/**** ACTION CREATORS ****/

const createSpotAction = (spot) => {
  return {
    type: POST_A_SPOT,
    payload: spot
  };
};

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

export const createSpot = (userSpotInput) => async (dispatch) => {
  const { country, address, city, state, description, name, price } = userSpotInput;
  let lat= 3, lng= 3; // hard code for now
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify({ address, city, state, country, lat, lng, name, description, price })
  });
  //console.log("response ---", response);

  const data = await response.json();
  dispatch(createSpotAction(data));
  //dispatch(getSpots([data]));
  return data;
};


  export const fetchAllSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots");
    const data = await response.json();
    //console.log("Data for GetAllSpots: --", data);
    dispatch(getSpots(data.Spots));//data.Spots)); // data));
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

const initialState = { allSpots: [], byId: {} };

const spotReducer = (state = initialState, action) => {
  let newState, newById = {};
  switch (action.type) {
    case GET_ALL_SPOTS:
      //console.log("action.payload ,, ---", action.payload);
      newState = { ...state, allSpots : action.payload, byId: {} };
      //newState.allSpots = action.payload;
      //newState.byId = {};

      // newState.allSpots = [ //returns double,, commented for now
      //   ...newState.allSpots,
      //   ...action.payload
      // ];

      newById = {...newState.byId};
      for(let spot of action.payload){
        newById[spot.id] = spot;
      }
      newState.byId = newById;

      //console.log("inside allSpots: ", newState.allSpots);
      //console.log("inside byId: ", newState.byId);

      return newState;

    case POST_A_SPOT:
      newState = { ...state };
      newState.allSpots = [
        ...newState.allSpots, 
        action.payload
      ];
      //newState.byId = [ ...newState.byId, action.payload];
      //for(let spot of action.payload.id){
      //  newById[spot.id] = spot;
      //}
      //action.payload.id = action.payload;
      newById = { ...newState.byId, [action.payload.id]: action.payload };
      //, [action.payload.id]: action.payload };
      newState.byId = newById;
      
      //console.log("inside allSpots: ", newState.allSpots);
      //console.log("inside byId: ", newState.byId);
    return newState;
      
    default:
      return state;
  }
};

export default spotReducer;