import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchOneSpotThunk } from '../../store/spots';
import { updateSpotThunk } from '../../store/spots';
import './UpdateSpot.css';

function UpdateSpot() {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const { spotId } = useParams();
    //console.log("SPOT ID: ", spotId);
    const spot = useSelector(state => state.spots.byId[spotId]);
    //console.log("SPOT --- : ", spot);

    //let [country, setCountry] = useState(); // ("");
    //let [country, setCountry] = useState("");
    let [country, setCountry] = useState("");
    //console.log("inside UpdateSpots::: ---", country);
    let [address, setAddress] = useState("");
    let [city, setCity] = useState("");
    let [state, setState] = useState("");
    let [description, setDescription] = useState("");
    let [name, setName] = useState("");
    let [price, setPrice] = useState("");

    useEffect(() => {
        //console.log("FETCHONETHUNK", spotId);
        dispatch(fetchOneSpotThunk(spotId));

    }, [dispatch, spotId]);

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
        if (spot) {
            //console.log("USEEFFECT---", spot);
            //console.log("USEEFFECT SPOT-ID---", spotId);//no
            setCountry(spot.country);
            setAddress(spot.address);
            setCity(spot.city);
            setState(spot.state);
            setDescription(spot.description);
            setName(spot.name);
            setPrice(spot.price);
        }
    }, [spot]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newPrice = 122;
        const updatedSpot = { country, address, city, state, description, name, newPrice };
        //console.log("spotID, updatedSPOT :::----", spotId, updatedSpot);
        await dispatch(updateSpotThunk(spotId, updatedSpot));

        navigate(`/spots/${spotId}`);
    };

    return (
        <div>
            <h1>Update Spot</h1>
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

                <button type="submit">Update Spot</button>
            </form>
        </div>
    );
}

export default UpdateSpot;
