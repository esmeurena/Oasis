import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpotThunk } from '../../store/spots';
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
  const [previewImage, setPreviewImage] = useState("");

  const stopWastingTime = () => {
    setCountry("United States");
    setAddress("1234 first st");
    setCity("San Diego");
    setState("California");
    setDescription("This is a beautiful little getaway in the north of San Diego.");
    setName("San Diego Getaway");
    setPrice(200);
    setPreviewImage("https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/560px-PNG_transparency_demonstration_1.png");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const spotData = { country, address, city, state, description, name, price, previewImage };
    const newSpot = await dispatch(createSpotThunk(spotData));
    //console.log("SHOULD HAVE IT TOO, IN CreateNewSpot.jsx: ", newSpot);
    // await dispatch(fetchAllSpotsThunk());
    navigate(`/spots/${newSpot.id}`);
  };

  return (
    <div>
      <h1>Create a New Spot</h1>
    
    <button onClick={stopWastingTime}>Stop Wasting Time</button>

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

        <label className="spot-input">
          <p className="spot-title-input">PreviewImage</p>
          <input 
            type="text" 
            placeholder="PreviewImage"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            required
          />
        </label>

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
}

export default CreateNewSpot;
