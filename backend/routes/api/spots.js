const express = require('express');
const { Op } = require('sequelize');
// Security Imports
const { setTokenCookie, restoreUser } = require('../../utils/auth');
//Utilities
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// Sequelize Imports 
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { Review } = require('../../db/models');
const { SpotImage, ReviewImage, Booking } = require('../../db/models');
const { ErrorHandler, noResourceError } = require('../../utils/errorHandler');
const router = express.Router();

//PROTECT INCOMING DATA FOR THE Create Spots ROUTE
// const checkQueryParams = [
//     check("page")
//         .isInt({min:1})
//         .withMessage('Page must ne greater than or equal to 1'),
//     check("size")
//         .isInt({min:1})
//         .withMessage("Size must by greater then 1"),
//     check("maxLat")
//         .isDecimal({max:90})
//         .withMessage("Maximum latitude is invalid"),
//     check("minLat")
//         .isDecimal({min:-90})
//         .withMessage("Minimum latitude is invalid"),
//     check("maxLng")
//         .isDecimal({max:180})
//         .withMessage("Maximum longitude is invalid"),
//     check("minLng")
//         .isDecimal({min:-180})
//         .withMessage("Minimum latitude is invalid"),
//     check("minPrice")
//         .isDecimal({min:0})
//         .withMessage("Minimum price must be greater than or equal to 0"),
//     check("maxPrice")
//         .isDecimal({min:0})
//         .withMessage("Maximum price must be greater than or equal to 0"),
//     handleValidationErrors


// ];
const validateReview = [
    check("review")
        .exists({checkFalsy: true})
        .withMessage('Review text is required'),
    check("stars")
        .exists({checkFalsy: true})
        .isInt({min:1,max:5})
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];
const validateSpots = [
    check('address')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Street address is required'),
    check('address')
        .exists({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage('Street address must be less than 100 characters'),
    check('city')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('City is required'),
    check('city')
        .exists({ checkFalsy: true })
        .isLength({ max: 30 })
        .withMessage('City must be less than 30 characters'),
    check('state')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('State is required'),
    check('state')
        .exists({ checkFalsy: true })
        .isLength({ max: 30 })
        .withMessage('State must be less than 30 characters'),
    check('country')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Country is required'),
    check('country')
        .exists({ checkFalsy: true })
        .isLength({ max: 30 })
        .withMessage('Country must be less than 30 characters'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Name is required'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Description is required'),
    check('description')
        .exists({ checkFalsy: true })
        .isLength({ max: 256 })
        .withMessage('Description must be less than 256 characters'),
    check('price')
        .exists({ checkFalsy: true })
        .isFloat({ min: 0.01 })
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];


// Done
router.get('/', async (req, res, next) => {
    try {
        let {page,size,maxLat,minLat,minLng,maxLng,minPrice,maxPrice} = await req.query
        if(!page) page = 1;
        if(!size) size = 25;
    
        const paginationObj = {
            limit:size,
            offset:size * (page -1)
        }
        if(maxLat === undefined) maxLat = 90;
        if(minLat === undefined) minLat = -90;
        if(minLng === undefined) minLng = -180;
        if(maxLng === undefined) maxLng = 180;
        if(minPrice === undefined) minPrice = 0;
        if (maxPrice === undefined) maxPrice = 100000000;


        const spots = await Spot.findAll({ 
            where:{
                lat: {
                    [Op.gte]:minLat,
                    [Op.lte]:maxLat
                },
                lng: {
                    [Op.gte]:minLng,
                    [Op.lte]:maxLng
                },
                price: {
                    [Op.gte]:minPrice,
                    [Op.lte]:maxPrice
                }
                
            },

            include: [{
                model:SpotImage,
                where: { preview : true },
                attributes: ['url']
        }],
        ...paginationObj
})
        const resArr = [];
        for (let spot of spots) {
            const spotBody = spot.toJSON();
            const reviews = await Review.findAll({ where: {spotId:spotBody.id}});
            const exsistsError = new ErrorHandler("Spot couldn't be found",404);
            let aveReview = 0;
            for(let review of reviews){
                aveReview += review.stars;
            }
            spotBody.aveReview = aveReview;

            if(spotBody.SpotImages && spotBody.SpotImages.length > 0){
                spotBody.previewImage = spotBody.SpotImages[0].url;
            }
            //else{
            //     spotBody.previewImage = ??;
            // }
            
            delete spotBody.SpotImages;

            resArr.push(spotBody);

        }
        if(req.query.page && req.query.size){
            return res.json({Spots:resArr,page:page,size:size});
        }
        return res.json({Spots:resArr});
    } catch (error) {
            next(error);
        }
    });

//Done
router.get('/current', async (req, res, next) => {
    try {
        if(!req.user){
            throw new noResourceError("User Not Signed In",404);
        }
        
        const currentUser = await req.user.id;
        const checkForSpots = await Spot.findByPk(currentUser);
        if(!checkForSpots){
            throw new noResourceError("This User Has No Spots", 404);
        }
        const userSpots = await Spot.findAll({
            where: {userId:currentUser},
            include:[{
                model:SpotImage,
            },
        ]
        })
        
        let resArr = []
        for(let spot of userSpots){
            const spotBody = spot.toJSON();
            const reviews = await Review.findAll({
                where:{
                    userId:spotBody.id
                }});
            let aveRating = 0;
            for(let review of reviews){
                aveRating += review.stars;
            }
            if(reviews.length < 1){
                spotBody.aveRating = 0;
            }else{
                spotBody.aveRating = aveRating/reviews.length;
            }
            if(spotBody.SpotImages[0]){
                spotBody.previewImage = spotBody.SpotImages[0];
            }else{
                spotBody.previewImage = "no previewImage";
            }
            delete spotBody.SpotImages;
            resArr.push(spotBody);
        }
        

        return res.json({Spots:resArr});

    } catch (error) {
        next(error);
    }
});

// Done
router.get('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const thisSpot = await Spot.findByPk(spotId);
        if(!thisSpot){
            const err = new noResourceError("Spot couldn't be found", 404);
            err.throwThis();
        }
        
        const spots = await Spot.findAll({where:{id:spotId}, include: [{
            model:SpotImage,
            attributes:{exclude:['spotId','createdAt','updatedAt']}
        },{
            model:User,
            as:"Owner",
            attributes: {exclude:['username','email','hashedPassword','createdAt','updatedAt']}
        }
    ]
})

        const resArr = []
        for (let spot of spots) {
            const spotBody = spot.toJSON();
            const reviews = await Review.findAll({ where: {spotId:spotBody.id}});
            let aveReview = 0;
            let numReviews = 0;
            for(let review of reviews){
                aveReview += review.stars;
                numReviews ++;
            }
            //did this manually cuz I couldn't get aveReviews and numReviews to go before spotReview
            let prettyBody = {};
            prettyBody.id = spotBody.id;
            prettyBody.userId = spotBody.userId;
            prettyBody.address = spotBody.address;
            prettyBody.city = spotBody.city;
            prettyBody.state = spotBody.state;
            prettyBody.country = spotBody.country;
            prettyBody.lat = spotBody.id;
            prettyBody.lng = spotBody.lng;
            prettyBody.name = spotBody.name;
            prettyBody.description = spotBody.description;
            prettyBody.price = spotBody.price;
            prettyBody.createdAt = spotBody.createdAt;
            prettyBody.updatedAt = spotBody.updatedAt;
            prettyBody.numReviews = numReviews;
            prettyBody.aveReview = aveReview;
            prettyBody.SpotImages = spotBody.SpotImages;
            prettyBody.Owner = spotBody.Owner;

            spotBody.SpotImages = spotBody.SpotImages;
            resArr.push(prettyBody);

        }
        return res.json(resArr);
    } catch (error) {
        next(error);
    }
});


// Done
router.get('/:spotId/reviews', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;

        if (!spotId) {
            throw new ErrorHandler("Spot couldn't be found", 404);
        }
        const reviews = await Review.findAll({
            where: {
                spotId: spotId
            },
            include: [
                { model: User,
                    attributes:{exclude:['username','hashedPassword','email','createdAt','updatedAt']}
                },
                { model: ReviewImage,
                    attributes:{exclude:['reviewId','createdAt','updatedAt']}
                }
            ]
        });

        let updatedReviews = [];
        for (let review of reviews) {
            const updatedReview = review.toJSON();
           if(!updatedReview.ReviewImage){
            delete updatedReview.ReviewImage;
           }
            updatedReviews.push(updatedReview);
        }

        return res.json({ Reviews: updatedReviews });
    } catch (error) {
        next(error);
    }
})

// DONE
router.get('/:spotId/bookings', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        //const userId = req.user.id;

        if(!spotId){
            throw new ErrorHandler("Spot couldn't be found", 404);
        }

        if(req.user){
            const bookings = await Booking.findAll({
                where: {
                    spotId: spotId
                },
                include: [
                    { model: User,
                        attributes:{exclude:['username','hashedPassword','email','createdAt','updatedAt']}
                    }
                ]
            });
            if(!bookings){
                throw new ErrorHandler("No Bookings for this SpotId found", 404);
            }
            return res.json({ Bookings: bookings });
        }else{
            const bookings = await Booking.findAll({
                where: {
                    spotId: spotId
                }
            });
            let updatedBookings = [];
            for (let booking of bookings) {
                const updatedBooking = booking.toJSON();
                delete updatedBooking.id;
                delete updatedBooking.userId;
                delete updatedBooking.createdAt;
                delete updatedBooking.updatedAt;
                updatedBookings.push(updatedBooking);
            }
            return res.json({ Bookings: updatedBookings });
        }

        //return res.json(bookings);
    } catch (error) {
        next(error);
    }
});

// Done
router.post('/', validateSpots, async (req, res, next) => {
    try {
        if(!req.user.id){
            throw new ErrorHandler("User needs to be signed in", 400);
        }
        const userId = await req.user.id;
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const newSpot = await Spot.create({
            userId: userId, address, city, state, country, lat, lng, name,
            description, price
        });

        const spotWithNoUserId = newSpot.toJSON();
        delete spotWithNoUserId.userId;

        return res.status(201).json(spotWithNoUserId);
    } catch (error) {
        next(error);
    }
});
// done
router.post('/:spotId/images', async (req, res, next) => {
    try {
        const routeId = req.params.spotId;
        const { url, preview } = req.body;

        if(!routeId){
            throw new ErrorHandler("Spot couldn't be found", 404);
        }

        const newImage = await SpotImage.create({ spotId: routeId, url, preview });

        return res.json(newImage);
    } catch (error) {
        next(error);
    }
});
// done
router.post('/:spotId/reviews',validateReview, async (req, res, next) => {
    try {
        const {spotId} = req.params
        const userId = req.user.id
        const { review, stars } = req.body;

        const spot = await Spot.findByPk(spotId)

        if(!spot){
            let noResourceError = new Error("Spot couldn't be found");
            noResourceError.status = 404;
            throw noResourceError
        }
        const userReview = await Review.findOne({
            where: {
                userId: userId
            }
        })

        if(!userReview){
            const newReview = await Review.create({ userId, spotId, userId, review, stars });
            res.status(201)
            return res.json(newReview);

        }else{
            throw new ErrorHandler("User already has a review for this spot.");
        }
        //const numSpot = Number(spot);

    } catch (error) {
        next(error);
    }
});
// NEEDS REDO
router.post('/:spotId/bookings', async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body
        const thisSpotId = req.params.spotId
        const userId = req.user.id

        const newBooking = await Booking.create({ spotId: thisSpotId, userId: userId, startDate, endDate })
        return res.json(newBooking)
    } catch (error) {
        next(error)
    }
});

// DONE
router.put('/:spotId', validateSpots, async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const userId = req.user.id;

        if(!req.user){
            throw new ErrorHandler("Spot must belong to the current user", 404);
        }

        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const spotToUpdate = await Spot.findByPk(spotId);
        if (!spotToUpdate) {
            throw new ErrorHandler("Spot couldn't be found", 404);
        } else {
            await spotToUpdate.update({ userId, address, city, state, country, lat, lng, name, description, price })

            return res.json({ spot: spotToUpdate })
        }
    } catch (error) {
        next(error)
    }
});

//DONE
router.delete('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const userId = req.user.id;

        const spotToDelete = await Spot.findByPk(spotId);

        if (!spotToDelete) {
             throw new ErrorHandler("No spot found with provided ID", 404)
        }

        if(spotToDelete.userId !== userId){
            throw new ErrorHandler("You are not authorized to delete this booking", 403);
        }

        await spotToDelete.destroy();
        return res.json({ message: "Spot deleted successfully" })

    } catch (error) {
        next(error)
    }
});
module.exports = router;
