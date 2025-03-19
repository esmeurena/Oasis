import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOneSpot } from '../../store/spots';
import './GetSingleSpot.css';

function GetSingleSpot() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    //const spot = useSelector((state) => state.spots.Spot);
    //const allSpotsArray = useSelector((state)=>state.spots.allSpots);
    //console.log("INSIDE GET SINGLE SPOT:--- ", allSpotsArray);
    //const spot = useSelector((state)=>state.spots.byId);
    //console.log("INSIDE byId:: ", spot);
    
    const spot = useSelector((state)=>state.spots.byId[spotId]);
    //console.log("INSIDE byId:: ", spot);
    //console.log("TESTTT spot[0].name: --- ", spot[0].name);
   //console.log("TESTTT spot.name: --- ", spot.name);
    
    useEffect(() => {
        dispatch(fetchOneSpot(spotId));
    }, [dispatch, spotId]);

    if (!spot) {
        return <div>No Spot Found!!</div>;
    }

    return (
        <div>
            <h1>{spot.name}</h1>
            <ul>
                <h2>{spot.city}, {spot.state}</h2>
                <div>
                    <li>
                        <img src={spot.previewImage} className="get-spot-image" />
                    </li>
                </div>
                {/* <p>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p> */}
                <p>{spot.description}</p>
                <div>
                    <h3>{spot.price} / night</h3>
                    <button onClick={() => alert('Feature coming soon!!')}>Reserve!!</button>
                </div>
            </ul>
        </div>
    );
}

export default GetSingleSpot;
