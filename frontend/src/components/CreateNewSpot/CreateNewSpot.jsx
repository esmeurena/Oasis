import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../../store/spots';
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
    const spotData = { country, address, city, state, description, name, price };
    const newSpot = await dispatch(createSpot(spotData));
    //const newSpot = await dispatch(createSpot({ country, address, city, state, description, name, price }));
    navigate(`/spots/${newSpot.id}`);
  };

  return (
    <div>
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Country
          <input 
            type="text" 
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>

        <label>
          Street Address
          <input 
            type="text" 
            placeholder="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>

        <label>
          City
          <input 
            type="text" 
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>

        <label>
          State
          <input 
            type="text" 
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea 
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Name for Spot
          <input 
            type="text" 
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Price
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
