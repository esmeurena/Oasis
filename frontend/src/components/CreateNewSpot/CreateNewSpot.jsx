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
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

  // const stopWastingTime = () => {
  //   setCountry("United States");
  //   setAddress("1234 first st");
  //   setCity("San Diego");
  //   setState("California");
  //   setDescription("This is a beautiful little getaway in the north of San Diego.");
  //   setName("San Diego Getaway");
  //   setPrice(200);
  //   setPreviewImage("https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/560px-PNG_transparency_demonstration_1.png");
  // };

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

      {/* <button onClick={stopWastingTime}>Stop Wasting Time</button> */}

      <form onSubmit={handleSubmit}>
        <div>
          <h2>Wheres your place located?</h2>
          <p>Guests will only get your exact address once they booked a reservation.</p>
          <label className="spot-input">
            {/* <p className="spot-title-input">Country</p> */}
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </label>

          <label className="spot-input">
            {/* <p className="spot-title-input">Street Address</p> */}
            <input
              type="text"
              placeholder="Street Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>

          <label className="spot-input">
            {/* <p className="spot-title-input">City</p> */}
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>

          <label className="spot-input">
            {/* <p className="spot-title-input">State</p> */}
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <h2>Describe your place to guests</h2>
          <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
          <label className="spot-input">
            {/* <p className="spot-title-input">Description</p> */}
            <textarea
              placeholder="Please write at least 30 characters"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <h2>Create a title for your spot</h2>
          <p>Catch guests attention with a spot title that highlights what makes your place special.</p>
          <label className="spot-input">
            {/* <p className="spot-title-input">Name for Spot</p> */}
            <input
              type="text"
              placeholder="Name of your spot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <label className="spot-input">
            {/* <p className="spot-title-input">Price</p> */}
            <input
              type="number"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <label className="spot-input">
            {/* <p className="spot-title-input">PreviewImage</p> */}
            <input
              type="text"
              placeholder="Preview Image URL"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              required
            />
          </label>
          <label className="spot-input">
            {/* <p className="spot-title-input">PreviewImage</p> */}
            <input
              type="text"
              placeholder="Image URL"
              value={image1}
              onChange={(e) => setPreviewImage(e.target.value)}
            />
          </label>
          <label className="spot-input">
            {/* <p className="spot-title-input">PreviewImage</p> */}
            <input
              type="text"
              placeholder="Image URL"
              value={image2}
              onChange={(e) => setPreviewImage(e.target.value)}
            />
          </label>
          <label className="spot-input">
            {/* <p className="spot-title-input">PreviewImage</p> */}
            <input
              type="text"
              placeholder="Image URL"
              value={image3}
              onChange={(e) => setPreviewImage(e.target.value)}
            />
          </label>
          <label className="spot-input">
            {/* <p className="spot-title-input">PreviewImage</p> */}
            <input
              type="text"
              placeholder="Image URL"
              value={image4}
              onChange={(e) => setPreviewImage(e.target.value)}
            />
          </label>
        </div>

        <button type="submit">Create Spot</button>
      </form>
    </div >
  );
}

export default CreateNewSpot;
