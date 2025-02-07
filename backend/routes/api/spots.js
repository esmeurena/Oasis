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
router.get('/:spotid', async (req, res, next) => {
    try {
        const spotId = await req.params;
        console.log(spot)

        const spot = await Spot.findByPk(spotId);

        if(spot){
            return res.json(spot)
        } else {
            throw new ErrorHandler("Spot not found",404)
        }
    } catch (error) {
        next(error)
    }
});
router.get('/:spotid/reviews', async (req, res, next) => {
    try {
    const spotId = req.params.id;
    const spot = await Spot.findByPk(spotId);
    const reviews = await Review.findAll({

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
        const spotId = req.params;

        return res.json(spotId)
        
    } catch (error) {
        next(error)
    }
});
router.post('/:spotid/reviews', async (req, res, next) => {
    try {
        const spot = req.params.id;
        const currentUser = await req.user.id
        const {spotId, userId, review, stars} = req.body

        if(spotId < 0 || (!userId && userId < 1 ) || !review || review === ""|| stars < 0){
            throw new ErrorHandler("Please check your data entered"), 400;
        }
        const newReview =  await Review.create({spotId, userId: currentUser, review, stars})
        return res.json(newReview)
    } catch (error) {
        next(error)
    }
});
// Spots PUT Method
router.put('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.id;
        const {address, city, state, country, lat, lng, name, description, price, previewImage} = req.body;
        const spotToUpdate = await Spot.findByPk(spotId);
        if(!spotToUpdate){
            throw new ErrorHandler("Spot not found", 404)
        }else{
            await spotToUpdate.update({address, city, state, country, lat, lng, name, description, price, previewImage})
            return res.json({spot: spotToUpdate})
        }
    } catch (error) {
        next(error)
    }
});
router.delete('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.id;
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