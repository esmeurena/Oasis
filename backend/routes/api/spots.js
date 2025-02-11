const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
// Security Imports
const { setTokenCookie, restoreUser } = require('../../utils/auth');
//Utilities
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// Sequelize Imports 
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { Review } = require('../../db/models');
const { SpotImage, ReviewImage, Booking }= require('../../db/models');
const { ErrorHandler } = require('../../utils/errorHandler'); 
const router = express.Router();

// Spot GET Method 
// Spot GET Method 
router.get('/', async (req, res, next) => {
    try {
        //filters for the queries
        const addFilter = (query, val, op, filterRules) => {//attribute to filter, value, operator, list of filter rules
            if(val){
                filterRules[query]= {
                    ...filterRules[query],
                    [op]:parseFloat(val)
                };
            }    
        };
    //try {
        let { 
            page = 1, 
            size = 5,
            minLat,
            maxLat,
            minLng,
            maxLng,
            minPrice,
            maxPrice 
        } = req.query;
        
        const pageNum = Math.min(Math.max(parseInt(page), 1), 5);
        const pageSize = Math.min(Math.max(parseInt(size), 1), 10);

        const limit = parseInt(pageSize);
        const offset = (pageNum-1)* limit;

        const filterRules = {};

        //greater than or equal to
        addFilter('lat', minLat, Op.gte, filterRules);
        addFilter('lng', minLng, Op.gte, filterRules);
        addFilter('price', minPrice, Op.gte, filterRules);

        //less than or equal to
        addFilter('lat', maxLat, Op.lte, filterRules);
        addFilter('lng', maxLng, Op.lte, filterRules);
        addFilter('price', maxPrice, Op.lte, filterRules);

        const spots = await Spot.findAll({//spots with filters and pagination
            where: filterRules,
            include: {
                model: SpotImage,
                where:{
                    preview:true
                },
                attributes: ['url']
            },
            limit: limit,
            offset: offset
        });
if(spots.length > 0) {

            //return res.json(spots); // dont need

            const withRatings = await Promise.all(spots.map(async(spot) => {

                //avgRating
                const reviews = await Review.findAll({where:{spotId:spot.id}});
                const avgRating = reviews.length > 0
                    ? reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length
                    : 0;

                //previewImage
                const previewImage = spot.SpotImages[0] ? spot.SpotImages[0].url : null;

                return{ //doing this manually so it looks like README
                    id: spot.id,
                    ownerId: spot.userId,
                    address: spot.address,
                    city: spot.city,
                    state: spot.state,
                    country: spot.country,
                    lat: spot.lat,
                    lng: spot.lng,
                    name: spot.name,
                    description: spot.description,
                    price: spot.price,
                    createdAt: spot.createdAt,
                    updatedAt: spot.updatedAt,
                    avgRating: avgRating,
                    previewImage: previewImage
                };
            }));
            if(page && pageSize){
                return res.json({
                    Spots: withRatings,//only the spots with ratings
                    page: pageNum,
                    size: pageSize
                });
            }else {
                return res.json({
                    Spots: withRatings
                })
            }

        }else{
            throw new ErrorHandler("No Spots Found", 404)
        }
    } catch (error) {
        next(error)
    }
});
router.get('/current', async (req, res, next) => {
    try {
        const currentUser = await req.user.id
        console.log(currentUser)
        
        const userSpots = await Spot.findAll({
            where: {
                id: currentUser
            },
            
        }
        );
        return res.json(userSpots);
        
    } catch (error) {
        next(error)
    }
});
router.get('/:spotId', async (req, res, next) => {
    try {
        const spot = await Spot.findByPk(req.params.spotId);
        if (!spot) {
            throw new ErrorHandler("Spot couldn't be found", 404);
        }
        return res.json(spot);
    } catch (error) {
        next(error);
    }
});
router.get('/:spotId/reviews', async (req, res, next) => {
    try {
    const spotId = req.params.spotId;
    // const spot = await Spot.findByPk(spotId);
    const reviews = await Review.findAll({
        where:{spotId: spotId},
        include: [
            {
            model:User,
            attributes: {exclude:['username','email','hashedPassword','createdAt','updatedAt']}
        },
        {
            model:ReviewImage,
            attributes: {exclude:['id','reviewId','createdAt','updatedAt']}
        }
        ]
    });
    return res.json({Reviews:reviews});
} catch (error) {
    next(error);
}
})
// router.get('/:spotId/reviews/aggregate', async (req, res, next) => {
//     try {
//         const spotId = req.params.spotId;

//         const spot = await Spot.findByPk(spotId);
//         if (!spot) {
//             return res.status(404).json({ message: "Spot not found" });
//         }

//         // Aggregate review data
//         const reviews = await Review.findOne({
//             where: { spotId: spotId },
//             attributes: [
//                 [sequelize.fn('AVG', sequelize.col('stars')), 'averageRating'],
//                 [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
//             ]
//         });
//         const aggregatedData = reviews[0].dataValues;

//         return res.json(aggregatedData);
//     } catch (error) {
//         next(error);
//     }
// });
router.get('/:spotId/bookings', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;

        if (!spotId) {
            throw new ErrorHandler("Spot Id not found", 404);
        }

        if (!isNaN(spotId)) {
            const checkedSpotId = parseInt(spotId, 10);
            const spot = await Spot.findByPk(checkedSpotId);

            if(!spot){
                throw new ErrorHandler("Spot not found", 404);
            }

            const bookings = await Booking.findAll({ 
                where: { 
                    spotId: checkedSpotId 
                } 
            });
            return res.json(bookings);
        }
        const bookings = await Booking.findAll({ where: { spotId } });
        return res.json(bookings);
    } catch (error) {
        next(error);
    }
});
// Spot POST Method 
router.post('/', async (req, res, next) => {
    try {
        const {address, city, state, country, lat, lng, name, description, price} = req.body;
        
        const errors = {};
        if (!address) errors.address = "Street address is required";
        if (!city) errors.city = "City is required";
        if (!state) errors.state = "State is required";
        if (!country) errors.country = "Country is required";
        if (!lat || lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
        if (!lng || lng < -180 || lng > 180) errors.lng = "Longitude must be within -180 and 180";
        if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
        if (!description) errors.description = "Description is required";
        if (!price || price <= 0) errors.price = "Price per day must be a positive number";

        if (Object.keys(errors).length > 0) {
            throw new ErrorHandler("Bad Request", 400, errors);
        }

        const newSpot = await Spot.create({
            address, city, state, country, lat, lng, name, 
            description, price, userId: req.user.id
        });
        return res.status(201).json(newSpot);
    } catch (error) {
        next(error);
    }
});
router.post('/:spotId/images', async (req, res, next) => {
    try {
        const routeId = req.params.spotId
        const {url,preview} = req.body

        const newImage = await SpotImage.create({spotId:routeId,url,preview});
        
        return res.json(newImage)
    } catch (error) {
        next(error)
    }
});
router.post('/:spotId/reviews', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const userId = await req.user.id;
        const {review, stars} = req.body;
        //const numSpot = Number(spot);
        //console.log(numSpot)
        const newReview =  await Review.create({spotId:spotId, userId, review, stars})
        return res.json(newReview)
    } catch (error) {
        next(error)
    }
});
router.post('/:spotId/bookings', async (req, res, next) => {
    try {
        const {startDate, endDate} = req.body
        const thisSpotId = req.params.spotId
        const userId = req.user.id

        const newBooking = await Booking.create({spotId:thisSpotId,userId:userId,startDate,endDate})
        return res.json(newBooking)
    } catch (error) {
        next(error)
    }
});
// Spots PUT Method
router.put('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const { userId, address, city, state, country, lat, lng, name, description, price, previewImage} = req.body;
        const spotToUpdate = await Spot.findByPk(spotId);
        if(!spotToUpdate){
            throw new ErrorHandler("Spot not found", 404)
        }else{
            await spotToUpdate.update({userId, address, city, state, country, lat, lng, name, description, price})
            
            return res.json({spot: spotToUpdate})
        }
    } catch (error) {
        next(error)
    }
});
router.delete('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const spotToDelete = await Spot.findByPk(spotId);
        if(spotToDelete){
            await spotToDelete.destroy();
            return res.json({ message: "Spot deleted successfully"})
        } else{
            throw new ErrorHandler("No spot found with provided ID", 404)
        }
    } catch (error) {
        next(error)
    }
});
module.exports = router;