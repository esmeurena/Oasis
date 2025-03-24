import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// import { fetchOneSpotThunk } from '../../store/spots';
import { updateSpotThunk } from '../../store/spots';
import './UpdateSpot.css';

function UpdateSpot() {
    //console.log("we innnnnnn");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.byId[spotId]);

    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [previewImage, setPreviewImage] = useState("");
    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");
    const [image3, setImage3] = useState("");
    const [image4, setImage4] = useState("");

    // useEffect(() => {
    //     console.log("useeffect1");
    //     dispatch(fetchOneSpotThunk(spotId));

    // }, [dispatch, spotId]);

    // const [isLoaded, setIsLoaded] = useState(false);

    // useEffect(() => {
    // console.log("INSIDE UPDATESPOT--", spotId);
    //     const retrieveOneSpot = async () => {
    //         await dispatch(fetchOneSpotThunk(spotId));
    //         setIsLoaded(true);
    //     }

    //     if (!isLoaded) {
    //         retrieveOneSpot();
    //       }

    // }, [dispatch, isLoaded]);

    useEffect(() => {
        //console.log("useeffect2");
        if (spot) {
            setCountry(spot.country);
            setAddress(spot.address);
            setCity(spot.city);
            setState(spot.state);
            setDescription(spot.description);
            setName(spot.name);
            setPrice(parseInt(spot.price));
            setPreviewImage(spot.previewImage);
        }
    }, [spot]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        //let newPrice = 122;
        const updatedSpotData = { country, address, city, state, description, name, price, previewImage };
        //console.log("spotID, updatedSPOT :::----", spotId, updatedSpot);
        const updatedSpot = await dispatch(updateSpotThunk(spotId, updatedSpotData));
        //console.log("updatedspot ---",updatedSpot.spot.id);
        navigate(`/spots/${updatedSpot.spot.id}`);
    };

    return (
        <div>
            <h1>Update Spot</h1>
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

                <button type="submit">Update Spot</button>
            </form>
        </div >
    );
}

export default UpdateSpot;
