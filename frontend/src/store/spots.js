/**** IMPORTS ****/

import { csrfFetch } from './csrf';

/**** ACTION TYPES ****/

const GET_ALL_SPOTS = "spots/getSpotsAction";
const GET_A_SPOT = "spots/getSpotAction";
const POST_A_SPOT = "spots/createSpotAction"
const UPDATE_A_SPOT = "spot/updateSpotAction"
const GET_CURRENT_SPOTS = "spot/getCurrentSpotsAction";
const DELETE_A_SPOT = "spot/deleteSpotAction";

/**** ACTION CREATORS ****/

const createSpotAction = (spot) => {
  return {
    type: POST_A_SPOT,
    payload: spot
  };
};

const getSpotsAction = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    payload: spots
  };
};

const updateSpotAction = (spot) => {
  return {
    type: UPDATE_A_SPOT,
    payload: spot
  };
};

const getSpotAction = (spot) => {
  return {
    type: GET_A_SPOT,
    payload: spot
  };
};

const getCurrentSpotsAction = (spots) => {
  return {
    type: GET_CURRENT_SPOTS,
    payload: spots
  };
};

const deleteSpotAction = (spot) => {
  return {
    type: DELETE_A_SPOT,
    payload: spot
  };
};

/**** THUNKS ****/

export const createSpotThunk = (userSpotInput) => async (dispatch) => {
  let { country, address, city, state, description, name, price, previewImage } = userSpotInput;
  //console.log("before price", price);
  price = parseInt(price);
  //console.log("after price", price);
  let lat = 3, lng = 3;
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify({ address, city, state, country, lat, lng, name, description, price, previewImage })
  });
  //console.log("response ---", response);

  const data = await response.json();
  //console.log("data ---", data);
  dispatch(createSpotAction(data));//try data.Spots
  //console.log("SHOULD HAVE CHANGES", data);
  //dispatch(getSpotsAction([data]));
  return data;
};

export const fetchAllSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  // console.log("FROM BACKEND GETALLSPOTS::: ", response);
  const data = await response.json();
  dispatch(getSpotsAction(data));//data.Spots)); // data));
  return response;
};

export const fetchOneSpotThunk = (spotId) => async (dispatch) => {
  try {
    //console.log("fetchone::: ", spotId);
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(getSpotAction(data));
      throw response;
    }
  } catch (error) {
    return error;
  }
};

export const updateSpotThunk = (spotId, updatedSpot) => async (dispatch) => {
  //console.log("WE DO GO INSIDE THUNK ----::");
  let { country, address, city, state, description, name, price, previewImage } = updatedSpot;
  price = parseInt(price)
  //console.log("ummmmmmmm -- ",country, address, city, state, description, name, price, previewImage);
  let lat = 3, lng = 3;
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify({ country, address, city, state, lat, lng, description, name, price, previewImage })
  });

  const data = await response.json();
  dispatch(updateSpotAction(data));
  return data;
};

export const getCurrentSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");
  // console.log("FROM BACKEND GETALLSPOTS::: ", response);
  const data = await response.json();
  dispatch(getCurrentSpotsAction(data));//data.Spots)); // data));
  return response;
};

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  //console.log("this one ~~~~~");
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE"
  });

  if (response.ok) {
    //const data = await response.json();
    dispatch(deleteSpotAction(spotId));
    //return data;
  }
}

/**** REDUCER ****/

const initialState = { allSpots: [], byId: {} };

const spotReducer = (state = initialState, action) => {
  let newState, newById = {}, newAllSpots = [], i = 0;

  switch (action.type) {

    case GET_ALL_SPOTS:
      //console.log("actionnnnn ----", action.payload);
      newState = { ...state };
      newState.allSpots = action.payload.Spots;

      for (let spot of action.payload.Spots) {
        newById[spot.id] = spot
      }

      newState.byId = newById;
      return newState;

    case GET_A_SPOT:
      //console.log("actionnnnn ----", action.payload);
      newState = { ...state };
      newState.allSpots = [action.payload];

      newState.byId[action.payload.id] = action.payload;
      return newState;

    case POST_A_SPOT:
      //console.log("action: ---", action.payload);
      newState = { ...state };
      newState.allSpots = [...newState.allSpots, action.payload];

      newState.byId = { ...newState.byId, [action.payload.id]: action.payload };

      return newState;

    case UPDATE_A_SPOT:
      //console.log("action ---: "action.payload);
      newState = { ...state };
      newState.allSpots = [...newState.allSpots, action.payload];

      newState.byId = { ...newState.byId, [action.payload.id]: action.payload };
      //newState.byId[action.payload.id] = action.payload;
      return newState;

    case GET_CURRENT_SPOTS:
      newState = { ...state };
      newState.allSpots = action.payload.Spots;

      for (let spot of action.payload.Spots) {
        newById[spot.id] = spot
      }

      newState.byId = newById;

      return newState;

    case DELETE_A_SPOT:
      newState = { ...state };
      //newState.allSpots = [];

      for(let spot of newState.allSpots){
        if(spot.id !== action.payload){
          newAllSpots[i] = spot;
          i++;
        }
      }

      newState.allSpots = newAllSpots;

      // newState.allSpots = newById;
      // for(let spot of action.payload.Spots){
      //   newById[spot.id] = spot
      // }
      // newState.byId = newById;
      delete newState.byId[action.payload];

      return newState;

    default:
      return state;
  }
};

export default spotReducer;