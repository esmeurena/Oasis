import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOneSpotThunk } from '../../store/spots';
import SingleSpotComponent from './SingleSpotComponent';
import './GetSingleSpot.css';

function GetSingleSpot() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    
    const spot = useSelector((state) => state.spots.byId[spotId]);
    //console.log("WE GET: --- ", spot);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {

        const retrieveOneSpot = async () => {
            //console.log("11111 ---SPOT-ID NOT INSIDE: ### -", spotId);
            await dispatch(fetchOneSpotThunk(spotId));
            setIsLoaded(true);
        }

        if(spot){
            setIsLoaded(true);
        }

        if (!isLoaded && !spot) {
            retrieveOneSpot();
          }

    }, [dispatch, spotId, isLoaded]);

    //console.log("spot you clicked: ", spot);
    if(!isLoaded){
        return <h1>Loading....</h1>
    }

    return (
        <div>
            <SingleSpotComponent spot={spot} />
        </div>
    );
}

export default GetSingleSpot;
