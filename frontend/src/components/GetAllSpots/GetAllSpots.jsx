import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSpots } from '../../store/spots';
import './GetAllSpots.css';

function GetAllSpots() {
  const dispatch = useDispatch();
  //console.log("inside GetAllSpots: ", useSelector((state)=>state.spots.spots));
  const spots = useSelector((state)=>state.spots.Spots);

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  if (!spots ||spots.length === 0) {
    return <div>No spots found</div>;
  }

return (
  <div>
    <h1>Get All Spots</h1>
    <ul>
      {spots.map((spot) => (
        <li key={spot.id}>
          {spot.previewImage && (
            <img src={spot.previewImage} className="spot-image"/>
          )}
          <h2>{spot.city}, {spot.state}</h2>
          <h3>{spot.price} / night </h3>

          <div className="tooltip">
            {spot.city}, {spot.state}
          </div>

        </li>
      ))}
    </ul>
  </div>
);
}

export default GetAllSpots;
