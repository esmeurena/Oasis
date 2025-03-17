import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOneSpot } from '../../store/spots';
import './GetSingleSpot.css';

function GetSingleSpot() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.Spot);
    //console.log("Inside GetSingleSpot: ", spot);
    
    useEffect(() => {
        dispatch(fetchOneSpot(spotId));
    }, [dispatch, spotId]);

    if (!spot) {
        return <div>No Spot Found!!</div>;
    }

    return (
        <div>
            <h1>{spot[0].name}</h1>
            <ul>
                <h2>{spot[0].city}, {spot[0].state}</h2>
                <div>
                    <li>
                        <img src={spot[0].SpotImages[0].url} className="get-spot-image" />
                    </li>
                </div>
                <p>Hosted by {spot[0].Owner.firstName} {spot[0].Owner.lastName}</p>
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
