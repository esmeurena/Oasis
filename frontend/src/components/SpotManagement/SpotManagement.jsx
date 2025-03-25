import { useEffect, useState } from 'react'; //React, 
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentSpotsThunk } from '../../store/spots';
import CurrentSpotsComponent from './CurrentSpotsComponent';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { deleteSpotThunk } from '../../store/spots';
import './SpotManagement.css';

const SpotManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentSpotsArray = useSelector((state) => state.spots.allSpots);
  const [isLoaded, setIsLoaded] = useState(false);
  console.log("current spots", currentSpotsArray);

  useEffect(() => {

    const retrieveSpots = async () => {
      await dispatch(getCurrentSpotsThunk());
      setIsLoaded(true);
    }

    if (!isLoaded) {
      retrieveSpots();
    }

  }, [dispatch, isLoaded]);

//   const goToSpotDetail = (e, spot) => {
//     e.preventDefault();
//     navigate(`/spots/${spot.id}`);
//   }

  const deleteTheSpot = async (spotId) => {
    await dispatch(deleteSpotThunk(spotId));

    navigate('/');

  };

  if (!isLoaded) {
    return (
        <div>
            <h1>Not loading!</h1>
        </div>
    );
  } else if(currentSpotsArray.length === 0){
    return (
        <div>
            <h1 className="cute-font-title">You have no Spots yet!</h1>
            <div className='horizontal-spots'>
              <Link to="/spots/newSpot" className="cute-font-button-create">Create a New Spot</Link>
            </div>
        </div>
    );
  }else {
    return (
      <div className="vertical-align">
        <h1 className="cute-font-title">Manage Spots</h1>
        <div className="horizontal-spots">
          {
            currentSpotsArray.map((spot, idx) => (
              <div key={`${idx}-${spot.id}`}>
                <CurrentSpotsComponent spot={spot} deleteSpot={deleteTheSpot} />
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default SpotManagement;