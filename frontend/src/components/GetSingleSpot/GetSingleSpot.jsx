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
    console.log("WE GET: --- ", spot);
    /**
     
address
: 
"jhbjhbjhbjhbjhb"
city
: 
"jhbjhbhjbjhbj"
country
: 
"hbjhbjhbjhb"
createdAt
: 
"2025-03-22T05:13:15.012Z"
description
: 
"jhbjhbjhbjhbhbjhbjhbjhbjhbjhbjhbjhbjhbjhbjhbjhbjh"
id
: 
10
lat
: 
3
lng
: 
3
name
: 
"bjhbhjbjhbjhbhjb"
previewImage
: 
"https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/560px-PNG_transparency_demonstration_1.png"
price
: 
1234
state
: 
"hbjhbjhbjhbhjb"
updatedAt
: 
"2025-03-22T05:13:15.012Z"
     * 
     */
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
