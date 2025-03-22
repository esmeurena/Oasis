import { useEffect, useState } from 'react'; //React, 
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSpotsThunk } from '../../store/spots';
import SpotsComponent from './SpotsComponent';
import { useNavigate } from 'react-router-dom';
import './GetAllSpots.css';

const GetAllSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allSpotsArray = useSelector((state) => state.spots.allSpots);
  //const allSpotsArray = useSelector((state) => state.spotReducer.allSpots);
  const [isLoaded, setIsLoaded] = useState(false);

  // if (!allSpotsArray) {
  //   return <h2>No spots found!!</h2>;
  // }

  useEffect(() => {

    const retrieveSpots = async () => {
      await dispatch(fetchAllSpotsThunk());
      setIsLoaded(true);
    }

    if (!isLoaded) {
      retrieveSpots();
    }

  }, [dispatch, isLoaded]);

  const goToSpotDetail = (e, spot) => {
    e.preventDefault();
    navigate(`/spots/${spot.id}`);
  }

  if (!isLoaded) {
    return <h1>Nothing Loaded</h1>;
  } else {
    return (
      <div>
        <div className="spot-container-list">
          {
            allSpotsArray.map((spot, idx) => (
              <div
                key={`${idx}-${spot.id}`}
                onClick={(e)=>goToSpotDetail(e,spot)}
                >
                <SpotsComponent spot={spot} />
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default GetAllSpots;