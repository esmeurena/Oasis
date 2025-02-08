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
const { SpotImage, ReviewImage }= require('../../db/models');
const { ErrorHandler } = require('../../utils/errorHandler'); 
const router = express.Router();

// Spot GET Method 
router.get('/', async (req, res, next) => {
    try {
        const spots = await Spot.findAll({
            include: {
                model: SpotImage,
                where:{
                    preview:true
                }
            }
        });
        if (spots) {
            
            return res.json(spots);
            
        } else {
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
        const spotId = await req.params.spotId;
        console.log(spotId)

        const spot = await Spot.findAll({
                include: {
                    model: SpotImage,
                    where:{
                        spotId: spotId,
                        preview:true
                    }
                }
            });

        if(spot){
            return res.json(spot)
        } else {
            throw new ErrorHandler("Spot not found",404)
        }
    } catch (error) {
        next(error)
    }
});
router.get('/:spotId/reviews', async (req, res, next) => {
    try {
    const spotId = req.params.spotId;
    // const spot = await Spot.findByPk(spotId);
    const reviews = await Review.findAll({
        where:{
            spotId: spotId
        }
    });
    return res.json(reviews);
} catch (error) {
    next(error);
}
})
router.get('/:spotId/reviews/aggregate', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;

        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot not found" });
        }

        // Aggregate review data
        const reviews = await Review.findOne({
            where: { spotId: spotId },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('stars')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
            ]
        });
        const aggregatedData = reviews[0].dataValues;

        return res.json(aggregatedData);
    } catch (error) {
        next(error);
    }
});
// Spot POST Method 
router.post('/', async (req, res, next) => {
    try {
        const {address, city, state, country, lat, lng, name, description, price} = req.body
        
        if(!address|| !city|| !state|| !country|| !lat|| !lng|| !name|| !price){
            throw new ErrorHandler("Please check your data entered", 400)
        }else{
            const newSpot = await Spot.create({address, city, state, country, lat, lng, name, description, price, userId: req.user.id});
            return res.json(newSpot)
        }
    } catch (error) {
        next(error)
    }
});
router.post('/:spotId/images', async (req, res, next) => {
    try {
        const isSpotId = req.params.spotId;
        const {spotId, url, preview} = req.body
        console.log(spotId)
        const newImage = SpotImage.create(spotId = isSpotId, url, preview)
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
        const newReview =  await Review.create({spotId, userId, review, stars})
        return res.json(newReview)
    } catch (error) {
        next(error)
    }
});
router.post('/:spotId/bookings', async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
});
// Spots PUT Method
router.put('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.id;
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
            const deletedSpot = await spotToDelete.destroy();
            return res.json({ message: "Spot deleted successfully"})
        } else{
            throw new ErrorHandler("No spot found with provided ID", 404)
        }
    } catch (error) {
        next(error)
    }
});
router.use((err,req,res,next)=>{
const errorMessage = err.message;
res.status = 500;
return res.json({
    message: errorMessage,
    status: res.status
})
})
module.exports = router;