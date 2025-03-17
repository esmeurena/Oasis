import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSpots } from '../../store/spots';
import { Link } from 'react-router-dom';
import './GetAllSpots.css';

function GetAllSpots() {
  const dispatch = useDispatch();
  //console.log("inside GetAllSpots: ", useSelector((state)=>state.spots.spots));
  const spots = useSelector((state)=>state.spots.Spots);

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  if(!spots) {
    return <h2>No spots found!!</h2>;
  }

return (
  <div>
    <h1>Get All Spots</h1>
    <ul>
      {spots.map((spot) => (
        <Link key={spot.id} to={`/spots/${spot.id}`}>
        <li>
          {spot.previewImage && (
            <img src={spot.previewImage} className="spot-image"/>
          )}
          <h2>{spot.city}, {spot.state}</h2>
          <h3>{spot.price} / night </h3>

          <div className="tooltip">
            {spot.city}, {spot.state}
          </div>

        </li>
        </Link>
      ))}
    </ul>
  </div>
);
}

export default GetAllSpots;
