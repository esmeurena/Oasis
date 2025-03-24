const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
// Security Imports
const { restoreUser, requireAuth } = require('../../utils/auth');

//Utilities
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// Sequelize Imports 
const { Review, ReviewImage, Spot, User } = require('../../db/models');

const router = express.Router();

// Format dates 
// const formatDate = (date) => date.toISOString().replace('T', ' ').substring(0, 19);

// Getting all reviews of the current user
router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;

        const reviews = await Review.findAll({
            where: { userId },
            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName'] },
                { model: Spot, attributes: ['id', 'userId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price',"createdAt","updatedAt"] },
                { model: ReviewImage, attributes: ['id', 'url'] }
            ]
        });
        // reviews.forEach(review => {
        //     review.dataValues.createdAt = formatDate(review.createdAt);
        //     review.dataValues.updatedAt = formatDate(review.updatedAt);
        // });

        return res.json({ Reviews: reviews });
    } catch (error) {
        next(error);
    }
});


// Get all reviews for a Spot by Spot ID
router.get('/:spotId/reviews', async (req, res, next) => {
    try {
        const { spotId } = req.params;

        const spot = await Spot.findByPk(spotId);
        const reviews = await Review.findAll({
            where: { spotId },
            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName'] },
                { model: ReviewImage, attributes: ['id', 'url'] }
            ],
            order: [['createdAt', 'DESC']],
        });

        // for(let i = 0; i < reviews.length; i++){
        //     for(let j = 0; j < reviews.length - 1; j++){
        //         let revs = reviews[j];
        //         reviews[j] = reviews[j + 1];
        //         reviews[j + 1] = revs;
        //     }
        // }

        // reviews.forEach(review => {
        //     review.dataValues.createdAt = formatDate(review.createdAt);
        //     review.dataValues.updatedAt = formatDate(review.updatedAt);
        // });

        // let avgRev = 0, totalRev = 0;
        // for (let review of reviews) {
        //     avgRev += review.stars;
        //     totalRev++;
        // }

        // if (totalRev > 0) {
        //     avgRev = (avgRev / totalRev).toFixed(1);

        // }
        // const reviewsData = {
        //     avgReviews: avgRev,
        //     totalReviews: totalRev
        // };

        return res.json({reviews});
        //return res.json({ Reviews: reviews });
    } catch (error) {
        next(error);
    }
});

//  Create a Review for a Spot
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    try {
        const { spotId } = req.params;
        const { review, stars } = req.body;
        const userId = req.user.id;

        const spot = await Spot.findByPk(spotId);
        if(!spot){
            const error = new Error("SPOT EMPTY");
        }

        const existingReview = await Review.findOne({ where: { spotId, userId } });
        if(existingReview){
            const error = new Error("ALREADY REVIEWD");
        }

        const newReview = await Review.create({
            userId,
            spotId,
            review,
            stars
        });

        newReview.dataValues.createdAt = formatDate(newReview.createdAt);
        newReview.dataValues.updatedAt = formatDate(newReview.updatedAt);

        return res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
});

// //  Add an Image to a Review
// router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
//     try {
//         const { reviewId } = req.params;
//         const { url } = req.body;
//         const userId = req.user.id;

//         const review = await Review.findByPk(reviewId);

//         const imageCount = await ReviewImage.count({ where: { reviewId } });
    
//         const newImage = await ReviewImage.create({ reviewId, url });

//         return res.json(newImage);
//     } catch (error) {
//         next(error);
//     }
// });

router.put('/:reviewId', requireAuth, async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { review, stars } = req.body;
        const userId = req.user.id;

        const existingReview = await Review.findByPk(reviewId);
        if(!existingReview){
            const error = new Error("REVIEW DOESNT EXIST");
        }

        if(existingReview.userId !== userId){
            const error = new Error("USER IS NOT OWNER");
        }

        existingReview.review = review;
        existingReview.stars = stars;
        await existingReview.save();

        return res.json(existingReview);
    } catch (error) {
        next(error);
    }
});

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await Review.findByPk(reviewId);
        if(!review){
            const error = new Error("REVIEW NON EXISTENT");
        }

        if(review.userId !== userId){
            const error = new Error("USER IS NOT OWNER");
        }

        await review.destroy();

        return res.json({ message: "Successfully deleted" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
