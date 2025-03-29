import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSpotThunk } from "../../store/spots";
import "./CreateNewSpot.css";

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

  const [validate, setValidate] = useState({});

  const validations = () => {
    const displayValidation = { ...validate };

    if(!country || country.length > 30 || country.length < 1){
      displayValidation.country = "Country is empty or must be between 1 and 30 characters";
    } else {
      delete displayValidation.country;
    }

    if(!address || address.length > 100 || address.length < 4 ){
      displayValidation.address = "Street address is empty or must be between 4 and 100 characters";
    }else{
      delete displayValidation.address;
    }

    if(!city || city.length > 30 || city.length < 1){
      displayValidation.city = "City is empty or must be between 1 and 30 characters";
    }else{
      delete displayValidation.city;
    }

    if(!state || state.length < 1 || state.length > 30){
      displayValidation.state = "State is empty or or must be between 1 than 30 characters";
    }else{
      delete displayValidation.state;
    }

    if(!description || description.length < 30 || description.length > 256){
      displayValidation.description = "Description is empty or must be between 30 and 256 characters";
    }else{
      delete displayValidation.description;
    }

    if(!name || name.length < 1 || name.length > 50){
      displayValidation.name = "Name is empty or must be between 1 and 50 characters";
    }else{
      delete displayValidation.name;
    }

    if(!price || price < 1){
      displayValidation.price = "Price is empty or must be more than 0";
    }else{
      delete displayValidation.price;
    }

    if(!previewImage){
      displayValidation.previewImage = "Preview Image is empty";
    }else{
      delete displayValidation.previewImage;
    }

    let noError = true;
    for(let validationMessage of Object.values(displayValidation)){
      if(validationMessage){
        noError = false;
        break; 
      }
    }
    setValidate(displayValidation);
    return noError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = Object.keys(validate).length === 0;

    if(!isValid){
      return;
    }
    const spotData = { country, address, city, state, description, name, price, previewImage };

    const newSpot = await dispatch(createSpotThunk(spotData));
    navigate(`/spots/${newSpot.id}`);
  };



  return (
    <div>
      <h1>Create a New Spot</h1>

      <button onClick={stopWastingTime}>Stop Wasting Time</button>

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
              // onChange={(e) => { validations(e.target.value, "country");
              //   if(!validate.country){
              //     setCountry(e.target.value);
              //   }
              // }}
              onChange={(e) => {
                const value = e.target.value;
                setCountry(value);
                validations(value, "country");
              }}
              required
            />
            {(() => {
              if(validate.country){
                return <div> {validate.country} </div>;
              }
            })()}
          </label>

          <label className="spot-input">
            {/* <p className="spot-title-input">Street Address</p> */}
            <input
              type="text"
              placeholder="Street Address"
              value={address}
              // onChange={(e) => { validations(e.target.value, "address");
              //   if(!validate.address){
              //     setAddress(e.target.value);
              //   }
              // }}
              onChange={(e) => {
                const value = e.target.value;
                setAddress(value);
                validations(value, "address");
              }}
              required
            />
            {(() => {
              if(validate.address){
                return <div> {validate.address} </div>;
              }
            })()}
          </label>

          <label className="spot-input">
            {/* <p className="spot-title-input">City</p> */}
            <input
              type="text"
              placeholder="City"
              value={city}
              // onChange={(e) => { validations(e.target.value, "city");
              //   if(!validate.city){
              //     setCity(e.target.value);
              //   }
              // }}
              onChange={(e) => {
                const value = e.target.value;
                setCity(value);
                validations(value, "city");
              }}
              required
            />
            {(() => {
              if(validate.city){
                return <div> {validate.city} </div>;
              }
            })()}
          </label>

          <label className="spot-input">
            {/* <p className="spot-title-input">State</p> */}
            <input
              type="text"
              placeholder="State"
              value={state}
              // onChange={(e) => { validations(e.target.value, "state");
              //   if(!validate.state){
              //     setState(e.target.value);
              //   }
              // }}
              onChange={(e) => {
                const value = e.target.value;
                setState(value);
                validations(value, "state");
              }}
              required
            />
            {(() => {
              if(validate.state){
                return <div> {validate.state} </div>;
              }
            })()}
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
              // onChange={(e) => { validations(e.target.value, "description");
              //   if(!validate.description){
              //     setDescription(e.target.value);
              //   }
              // }}
              onChange={(e) => {
                const value = e.target.value;
                setDescription(value);
                validations(value, "description");
              }}
              required
            />
            {(() => {
              if(validate.description){
                return <div> {validate.description} </div>;
              }
            })()}
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
              // onChange={(e) => { validations(e.target.value, "name");
              //   if(!validate.name){
              //     setName(e.target.value);
              //   }
              // }}
              onChange={(e) => {
                const value = e.target.value;
                setName(value);
                validations(value, "name");
              }}
              required
            />
            {(() => {
              if(validate.name){
                return <div> {validate.name} </div>;
              }
            })()}
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
              // onChange={(e) => { validations(e.target.value, "price");
              //   if(!validate.price){
              //     setPrice(e.target.value);
              //   }
              // }}
              onChange={(e) => {
                const value = e.target.value;
                setPrice(value);
                validations(value, "price");
              }}
              required
            />
            {(() => {
              if(validate.price){
                return <div> {validate.price} </div>;
              }
            })()}
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
              // onChange={(e) => { validations(e.target.value, "previewImage");
              //   if(!validate.previewImage){
              //     setPreviewImage(e.target.value);
              //   }
              // }}
              onChange={(e) => {
                const value = e.target.value;
                setPreviewImage(value);
                validations(value, "previewImage");
              }}
              required
            />
            {(() => {
              if(validate.previewImage){
                return <div> {validate.previewImage} </div>;
              }
            })()}
          </label>
          <label className="spot-input">
            {/* <p className="spot-title-input">PreviewImage</p> */}
            <input
              type="text"
              placeholder="Image URL"
              value={image1}
              // onChange={(e) => { validations(e.target.value, "image1");
              //   if(!validate.image1){
              //     setImage1(e.target.value);
              //   }
              // }}
              onChange={(e) => {
                const value = e.target.value;
                setImage1(value);
                // validations(value, "image1");
              }}
            />
          </label>
          <label className="spot-input">
            {/* <p className="spot-title-input">PreviewImage</p> */}
            <input
              type="text"
              placeholder="Image URL"
              value={image2}
              // onChange={(e) => { validations(e.target.value, "image2");
              //   if(!validate.image2){
              //     setImage2(e.target.value);
              //   }
              // }}
              onChange={(e) => {
                const value = e.target.value;
                setImage2(value);
                // validations(value, "image2");
              }}
            />
          </label>
          <label className="spot-input">
            {/* <p className="spot-title-input">PreviewImage</p> */}
            <input
              type="text"
              placeholder="Image URL"
              value={image3}
              // onChange={(e) => { validations(e.target.value, "image3");
              //   if(!validate.image3){
              //     setImage3(e.target.value);
              //   }
              // }}
              onChange={(e) => {
                const value = e.target.value;
                setImage3(value);
                // validations(value, "image3");
              }}
            />
          </label>
          <label className="spot-input">
            {/* <p className="spot-title-input">PreviewImage</p> */}
            <input
              type="text"
              placeholder="Image URL"
              value={image4}
              // onChange={(e) => { validations(e.target.value, "image4");
              //   if(!validate.image4){
              //     setImage4(e.target.value);
              //   }
              // }}
              onChange={(e) => {
                const value = e.target.value;
                setImage4(value);
                // validations(value, "image4");
              }}
            />
          </label>

        </div>

        <button type="submit">Create Spot</button>
      </form>
    </div >
  );
}

export default CreateNewSpot;
