import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpotThunk, fetchAllSpotsThunk } from '../../store/spots';
import './CreateNewSpot.css';

function CreateNewSpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newPrice = 777;
    const spotData = { country, address, city, state, description, name, newPrice };
    const newSpot = await dispatch(createSpotThunk(spotData));
    //console.log("SHOULD HAVE IT TOO, IN CreateNewSpot.jsx: ", newSpot);
    await dispatch(fetchAllSpotsThunk());
    navigate(`/spots/${newSpot.id}`);
  };

  return (
    <div>
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit}>
        <label className="spot-input">
          <p className="spot-title-input">Country</p>
          <input
            type="text" 
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>

        <label className="spot-input">
          <p className="spot-title-input">Street Address</p>
          <input 
            type="text" 
            placeholder="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>

        <label className="spot-input">
          <p className="spot-title-input">City</p>
          <input 
            type="text" 
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>

        <label className="spot-input">
          <p className="spot-title-input">State</p>
          <input 
            type="text" 
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>

        <label className="spot-input">
          <p className="spot-title-input">Description</p>
          <textarea 
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label className="spot-input">
          <p className="spot-title-input">Name for Spot</p>
          <input 
            type="text" 
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="spot-input">
          <p className="spot-title-input">Price</p>
          <input 
            type="number" 
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
}

export default CreateNewSpot;
