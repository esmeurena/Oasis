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
const router = express.Router();

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
    handleValidationErrors
];


// Done
router.get('/', async (req, res, next) => {
    try {
        let { page, size, maxLat, minLat, minLng, maxLng, minPrice, maxPrice } = await req.query
        if (!page) page = 1;
        if (!size) size = 25;

        const paginationObj = {
            limit: size,
            offset: size * (page - 1)
        }
        if (maxLat === undefined) maxLat = 90;
        if (minLat === undefined) minLat = -90;
        if (minLng === undefined) minLng = -180;
        if (maxLng === undefined) maxLng = 180;
        if (minPrice === undefined) minPrice = 0;
        if (maxPrice === undefined) maxPrice = 100000000;

        /*
const spot = await Spot.findByPk(spotId,{
            include: [{
                model:SpotImage,
                attributes:['spotId','url','preview']
            },{
                model:User,
                as:"Owner",
                attributes: {exclude:['username','email','hashedPassword','createdAt','updatedAt']}
            }]
        });
        */

        const spots = await Spot.findAll({
            where: {
                lat: {
                    [Op.gte]: minLat,
                    [Op.lte]: maxLat
                },
                lng: {
                    [Op.gte]: minLng,
                    [Op.lte]: maxLng
                },
                price: {
                    [Op.gte]: minPrice,
                    [Op.lte]: maxPrice
                }

            },

            include: [{
                model:SpotImage,
                attributes:['spotId','url','preview']
            },{
                model:User,
                as:"Owner",
                attributes: {exclude:['username','email','hashedPassword','createdAt','updatedAt']}
            }],
            ...paginationObj
        })
        const resArr = [];
        for (let spot of spots) {
            const reviews = await Review.findAll({ where: { spotId: spot.id } });
            let aveReview = 0;
            let totalRevs = 0;
            for (let review of reviews) {
                aveReview += review.stars;
                totalRevs++;
            }
            if (totalRevs > 0) {
                aveReview = aveReview / totalRevs;
            }
            const prettyDataSpot = {
                id: spot.id,
                userId: spot.userId,
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
                numReviews: totalRevs,
                aveReview: aveReview,
                previewImage: spot.SpotImages[0].url,
                Owner: spot.Owner,
            };
            //const spotBody = spot.toJSON();
            //const reviews = await Review.findAll({ where: { spotId: spotBody.id } });

            //spotBody.aveReview = aveReview;

            // if (spot.SpotImages && spot.SpotImages.length > 0) {
            //     prettyDataSpot.previewImage = spot.SpotImages[0].url;
            // }
            //else{
            //     spotBody.previewImage = ??;
            // }

            //delete spotBody.SpotImages;

            resArr.push(prettyDataSpot);
        }
        if (req.query.page && req.query.size) {
            return res.json({ Spots: resArr, page: page, size: size });
        }
        return res.json({ Spots: resArr });
    } catch (error) {
        next(error);
    }
});

//Done
router.get('/current', async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error("User Not Signed In", 404);
        }

        const currentUser = await req.user.id;
        // const checkForSpots = await Spot.findByPk(currentUser);
        // if (!checkForSpots) {
        //     throw new Error("This User Has No Spots", 404);
        // }
        const userSpots = await Spot.findAll({
            where: { userId: currentUser },
            include: [{
                model:SpotImage,
                attributes:['spotId','url','preview']
            },{
                model:User,
                as:"Owner",
                attributes: {exclude:['username','email','hashedPassword','createdAt','updatedAt']}
            }],
        })

        let resArr = []
        for (let spot of userSpots) {
            const spotBody = spot.toJSON();
            const reviews = await Review.findAll({
                where: {
                    userId: spotBody.id
                }
            });
            let aveRating = 0;
            for (let review of reviews) {
                aveRating += review.stars;
            }
            if (reviews.length < 1) {
                spotBody.aveRating = 0;
            } else {
                spotBody.aveRating = aveRating / reviews.length;
            }
            if (spotBody.SpotImages[0]) {
                spotBody.previewImage = spotBody.SpotImages[0].url;
            } else {
                spotBody.previewImage = "no previewImage";
            }
            delete spotBody.SpotImages;
            resArr.push(spotBody);
        }


        return res.json({ Spots: resArr });

    } catch (error) {
        next(error);
    }
});

// Done
router.get('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId,{
            include: [{
                model:SpotImage,
                attributes:['spotId','url','preview']
            },{
                model:User,
                as:"Owner",
                attributes: {exclude:['username','email','hashedPassword','createdAt','updatedAt']}
            }]
        });

        if(!spot){
            throw new Error("NO SPOT");
        }

        const allReviews = await Review.findAll({ 
            where: { 
                spotId: spot.id 
            }});

        let avgRev = 0, totalRev = 0;
        for(let review of allReviews){
            avgRev += review.stars;
            totalRev++;
        }
    
        if(totalRev > 0){
            avgRev = avgRev / totalRev;
        }

    
        const prettyDataSpot = {
            id: spot.id,
            userId: spot.userId,
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
            numReviews: totalRev,
            aveReview: avgRev,
            previewImage: spot.SpotImages[0].url,
            Owner: spot.Owner,
        };

        return res.json(prettyDataSpot);
    } catch (error) {
        next(error);
    }
});


// Done
router.get('/:spotId/reviews', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;

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
        const userId = await req.user.id;
        const { address, city, state, country, lat, lng, name, description, price, previewImage } = req.body;


        const spot = await Spot.create({
            userId: userId, address, city, state, country, lat, lng, name,
            description, price
        });
        const newImage = await SpotImage.create({ spotId : spot.id, url : previewImage, preview : true });

        /*
        const spot = await Spot.findByPk(spotId,{
            include: [{
                model:SpotImage,
                attributes:['spotId','url','preview']
            },{
                model:User,
                as:"Owner",
                attributes: {exclude:['username','email','hashedPassword','createdAt','updatedAt']}
            }]
        });
        */
        let avgRev = 0, totalRev = 0;
        const prettyDataSpot = {
            id: spot.id,
            userId: spot.userId,
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
            numReviews: totalRev,
            aveReview: avgRev,
            previewImage: previewImage,
            //Owner: spot.Owner,
        };

        //const spotWithNoUserId = newSpot.toJSON();
        //spotWithNoUserId.previewImage = newImage.url;
        // delete spotWithNoUserId.userId;

        return res.status(201).json(prettyDataSpot);
    } catch (error) {
        next(error);
    }
});
// done
router.post('/:spotId/images', async (req, res, next) => {
    try {
        const routeId = req.params.spotId;
        const { url, preview } = req.body;
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
            throw new Error("Spot couldn't be found");
        }
        const userReview = await Review.findOne({
            where: {
                userId: userId,
                spotId: spotId
            }
        })

        if(!userReview){
            const newReview = await Review.create({ userId, spotId, userId, review, stars });
            res.status(201)
            return res.json(newReview);

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

        const { address, city, state, country, lat, lng, name, description, price, previewImage} = req.body;

        const spotToUpdate = await Spot.findByPk(spotId);
        if (spotToUpdate.userId !== userId) {
            throw new Error("USER IS NOT OWNER");
        }
        await spotToUpdate.update({ userId, address, city, state, country, lat, lng, name, description, price, previewImage });
        return res.json({ spot: spotToUpdate });
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
        if(spotToDelete.userId !== userId){
            throw new Error("USER IS NOT OWNER");
        }

        await spotToDelete.destroy();
        return res.json({ message: "Spot deleted successfully" })

    } catch (error) {
        next(error)
    }
});
module.exports = router;
