/**** IMPORTS ****/

import { csrfFetch } from './csrf';

/**** ACTION TYPES ****/

const GET_ALL_SPOTS = "spots/getSpotsAction";
const GET_A_SPOT = "spots/getSpot";
const POST_A_SPOT = "spots/createSpotAction"
const UPDATE_A_SPOT = "spot/updateSpotAction"

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

/**** THUNKS ****/

export const createSpotThunk = (userSpotInput) => async (dispatch) => {
  let { country, address, city, state, description, name, price, previewImage } = userSpotInput;
  //console.log("price", price);
  price = parseInt(price);
  let lat = 3, lng = 3;
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify({ address, city, state, country, lat, lng, name, description, price, previewImage })
  });
  //console.log("response ---", response);

  const data = await response.json();
  //console.log("SHOULD HAVE CHANGES", data);
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
    console.log("fetchone::: ", spotId);
    const res = await csrfFetch(`/api/spots/${spotId}`);
    if (res.ok) {
      const data = await res.json();
      dispatch(getSpotAction(data));
      throw res;
    }
  } catch (error) {
    return error;
  }
};

export const updateSpotThunk = (spotId, updatedSpot) => async (dispatch) => {
  let { country, address, city, state, description, name, price } = updatedSpot;
  price = 711;
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify({ country, address, city, state, description, name, price })
  });

  const data = await response.json();
  dispatch(updateSpotAction(data));
  return data;
};

/**** REDUCER ****/

const initialState = { allSpots: [], byId: {} };

const spotReducer = (state = initialState, action) => {
  let newState, newById = {};

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

    // newState = { ...state, allSpots: action.payload };
    // console.log("inside action.payload: ", action.payload);

    // if (action.payload.singleSpot) {
    //   const singleSpot = action.payload.singleSpot;
    //   newById[singleSpot.id] = singleSpot;
    // } else {
    //   newById = { ...newState.byId };
    //   for (let spot of action.payload) {
    //     newById[spot.id] = spot;
    //   }
    // }
    // newState.byId = newById;

    // console.log("inside allSpots: ", newState.allSpots);
    // console.log("inside byId: ", newState.byId);

    // return newState;

    case GET_A_SPOT:
      console.log("actionnnnn ----", action.payload);
      newState = { ...state };
      newState.allSpots = [action.payload];
      //newById[spot.id] = spot

      newState.byId[action.payload.id] = action.payload;
      return newState;

    case POST_A_SPOT:
      console.log("BEFORE: ---", action.payload);
      newState = { ...state };

      newState.allSpots = [...newState.allSpots, action.payload];
      // newState.allSpots,action.payload;

      newState.byId = { ...newState.byId, [action.payload.id]: action.payload };
      // newState.allSpots = [
      //   ...newState.allSpots,
      //   action.payload
      // ];
      //newState.byId = [ ...newState.byId, action.payload];
      //for(let spot of action.payload.id){
      //  newById[spot.id] = spot;
      //}
      //action.payload.id = action.payload;
      //newById = { ...newState.byId, [action.payload.id]: action.payload };
      //newState.byId = { ...newState.byId, [action.payload.id]: action.payload };

      //, [action.payload.id]: action.payload };
      //newState.byId = newById;

      //console.log("inside allSpots: ", newState.allSpots);
      //console.log("inside byId: ", newState.byId);
      return newState;

    case UPDATE_A_SPOT:
      newState = { ...state, allSpots: [] };
      //console.log("PUT_A_SPOT: "action.payload);
      for (let spot of newState.allSpots) {
        if (spot.id === action.payload.id) {
          newState.allSpots.push(action.payload);
        } else {
          newState.allSpots.push(spot);
        }
      }
      newState.byId = { ...newState.byId, [action.payload.id]: action.payload };

      return newState;

    default:
      return state;
  }
};

export default spotReducer;