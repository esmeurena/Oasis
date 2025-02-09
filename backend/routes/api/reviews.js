const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Security Imports
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

//Utilities
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// Sequelize Imports 
const { Review } = require('../../db/models');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { ErrorHandler } = require('../../utils/errorHandler');

const router = express.Router();
router.get('/', async (req, res, next) => {
    try {
        const reviews = await Review.findAll();

        if (reviews){
            return res.json(reviews);
        } else {
            throw new ErrorHandler("No reviews found", 404);
        }
    } catch (error) {
        next(error);
    }

});
router.get('/spots/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;

        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            throw new ErrorHandler("Spot not found", 404);
        }

        const reviews = await Review.findAll({
            where: { spotId }
        });

        return res.json(reviews);
    } catch (error) {
        next(error);
    }
});
router.post('/spots/:spotId', requireAuth, async (req, res, next) => {
    try {
        const { review, stars } = req.body;
        const spotId = req.params.spotId;
        const userId = req.user.id;

        const errors = {};
        if (!review) errors.review = "Review text is required";
        if (!stars || stars < 1 || stars > 5) errors.stars = "Stars must be an integer from 1 to 5";

        if (Object.keys(errors).length > 0) {
            throw new ErrorHandler("Bad Request", 400, errors);
        }

        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            throw new ErrorHandler("Spot couldn't be found", 404);
        }

        // Check for existing review
        const existingReview = await Review.findOne({
            where: { userId, spotId }
        });

        if (existingReview) {
            throw new ErrorHandler("User already has a review for this spot", 500);
        }

        const newReview = await Review.create({ userId, spotId, review, stars });
        return res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
});
// PUT (update) a review
router.put('/:reviewId', requireAuth, async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId;
        const { review, stars } = req.body;
        const userId = req.user.id;

        const reviewToUpdate = await Review.findByPk(reviewId);
        if (!reviewToUpdate) {
            throw new ErrorHandler("Review not found", 404);
        }

        if (reviewToUpdate.userId !== userId) {
            throw new ErrorHandler("You are not authorized to update this review", 403);
        }

        await reviewToUpdate.update({ review, stars });

        return res.json(reviewToUpdate);
    } catch (error) {
        next(error);
    }
});

// DELETING a review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.user.id;

        const reviewToDelete = await Review.findByPk(reviewId);
        if (!reviewToDelete) {
            throw new ErrorHandler("Review not found", 404);
        }

        if (reviewToDelete.userId !== userId) {
            throw new ErrorHandler("You are not authorized to delete this review", 403);
        }

        await reviewToDelete.destroy();

        return res.json({ message: "Review successfully deleted" });
    } catch (error) {
        next(error);
    }
});



module.exports = router;