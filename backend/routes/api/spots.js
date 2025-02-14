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
const { ErrorHandler } = require('../../utils/errorHandler');
const router = express.Router();

//PROTECT INCOMING DATA FOR THE Create Spots ROUTE
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


// NEEDS REDO
router.get('/', async (req, res, next) => {
    try {
        const spotId = await req.params.spotId;
        return res.json(spotId);
    } catch (error) {
        next(error)
    }
});

//NEEDS REDO
router.get('/current', async (req, res, next) => {
    try {
        const currentUser = await req.user.id
        //console.log(currentUser)

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

// GET - Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    try {
        const spotId = await req.params.spotId;

        const spots = await Spot.findByPk( spotId, {
            include: [
                {
                    model: SpotImage,
                    attributes:{exclude:['spotId', 'createdAt', 'updatedAt']}
                },
                {
                    model: User,
                    //as:'Owner'
                    attributes:{exclude:['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']}
                }
            ],
        });
        const numRevs = spots.Reviews.length;
        
        return res.json({spots});
    } catch (error) {
        next(error);
    }
});


// GET - Get all Reviews by a Spot's id
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
                { model: User },
                { model: ReviewImage }
            ]
        });

        let updatedReviews = [];
        for (let review of reviews) {
            const updatedReview = review.toJSON();
            delete updatedReview.User.username;
            delete updatedReview.ReviewImage.reviewId;
            delete updatedReview.ReviewImage.createdAt;
            delete updatedReview.ReviewImage.updatedAt;
            updatedReviews.push(updatedReview);
        }

        return res.json({ Reviews: updatedReviews });
    } catch (error) {
        next(error);
    }
})

//NEEDS REDO
router.get('/:spotId/bookings', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        if (!isNaN(spotId)) {
            const checkedSpotId = parseInt(spotId, 10);
            const spot = await Spot.findByPk(checkedSpotId);

            if (!spot) {
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

// POST - Create a Spot
router.post('/', validateSpots, async (req, res, next) => {
    try {
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
//NEEDS REDO
router.post('/:spotId/images', async (req, res, next) => {
    try {
        const routeId = req.params.spotId
        const { url, preview } = req.body

        const newImage = await SpotImage.create({ spotId: routeId, url, preview });

        return res.json(newImage)
    } catch (error) {
        next(error)
    }
});
// NEEDS REDO
router.post('/:spotId/reviews', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const userId = await req.user.id;
        const { review, stars } = req.body;
        //const numSpot = Number(spot);
        //console.log(numSpot)
        const newReview = await Review.create({ spotId: spotId, userId, review, stars });
        return res.status(201).json(newReview);
    } catch (error) {
        next(error)
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
// NEEDS REDO
router.put('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const { userId, address, city, state, country, lat, lng, name, description, price, previewImage } = req.body;

        const errors = {};
        if (!userId) errors.userId = "UserId is required";
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

        const spotToUpdate = await Spot.findByPk(spotId);
        if (!spotToUpdate) {
            throw new ErrorHandler("Updating a Spot that does not exist", 404)
        } else {
            await spotToUpdate.update({ userId, address, city, state, country, lat, lng, name, description, price })

            return res.json({ spot: spotToUpdate })
        }
    } catch (error) {
        next(error)
    }
});
//NEEDS REDO
router.delete('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const spotToDelete = await Spot.findByPk(spotId, {logging:false});

        if(!spotToDelete){
            throw new ErrorHandler("No spot found with provided ID", 404)
        }

        await Booking.destroy({
            where: { spotId }
        });
        await SpotImage.destroy({
            where: { spotId }
        });

        await spotToDelete.destroy();
        return res.json({ message: "Spot deleted successfully" })

    } catch (error) {
        next(error)
    }
});
module.exports = router;