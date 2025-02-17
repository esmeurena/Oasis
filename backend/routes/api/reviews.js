const express = require('express');
const { Op } = require('sequelize');

// Security Imports
const { restoreUser, requireAuth } = require('../../utils/auth');

// Sequelize Imports 
const { Review, ReviewImage, Spot, User } = require('../../db/models');
const { ErrorHandler } = require('../../utils/errorHandler');

const router = express.Router();

// Format dates 
const formatDate = (date) => date.toISOString().replace('T', ' ').substring(0, 19);

// Getting all reviews of the current user
router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;

        const reviews = await Review.findAll({
            where: { userId },
            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName'] },
                { model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'] },
                { model: ReviewImage, attributes: ['id', 'url'] }
            ]
        });
        reviews.forEach(review => {
            review.dataValues.createdAt = formatDate(review.createdAt);
            review.dataValues.updatedAt = formatDate(review.updatedAt);
        });

        return res.json({ Reviews: reviews });
    } catch (error) {
        next(new ErrorHandler("Failed to fetch reviews", 500, error.errors));
    }
});


// Get all reviews for a Spot by Spot ID
router.get('/:spotId/reviews', async (req, res, next) => {
    try {
        const { spotId } = req.params;

        const spot = await Spot.findByPk(spotId);
        if (!spot) throw new ErrorHandler("Spot couldn't be found", 404);

        const reviews = await Review.findAll({
            where: { spotId },
            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName'] },
                { model: ReviewImage, attributes: ['id', 'url'] }
            ]
        });
        reviews.forEach(review => {
            review.dataValues.createdAt = formatDate(review.createdAt);
            review.dataValues.updatedAt = formatDate(review.updatedAt);
        });

        return res.json({ Reviews: reviews });
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
        if (!spot) throw new ErrorHandler("Spot couldn't be found", 404);

        const existingReview = await Review.findOne({ where: { spotId, userId } });
        if (existingReview) throw new ErrorHandler("User already has a review for this spot", 500);

        if (!review || !stars || stars < 1 || stars > 5) {
            throw new ErrorHandler("Validation error", 400, {
                review: "Review text is required",
                stars: "Stars must be an integer from 1 to 5"
            });
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

//  Add an Image to a Review
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { url } = req.body;
        const userId = req.user.id;

        const review = await Review.findByPk(reviewId);
        if (!review) throw new ErrorHandler("Review couldn't be found", 404);

        if (review.userId !== userId) throw new ErrorHandler("Forbidden", 403);

        const imageCount = await ReviewImage.count({ where: { reviewId } });
        if (imageCount >= 10) throw new ErrorHandler("Maximum number of images for this resource was reached", 403);

        const newImage = await ReviewImage.create({ reviewId, url });

        return res.json(newImage);
    } catch (error) {
        next(error);
    }
});

//  Edit a Review
router.put('/:reviewId', requireAuth, async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { review, stars } = req.body;
        const userId = req.user.id;

        const existingReview = await Review.findByPk(reviewId);
        if (!existingReview) throw new ErrorHandler("Review couldn't be found", 404);

        if (existingReview.userId !== userId) throw new ErrorHandler("Forbidden", 403);

        if (!review || !stars || stars < 1 || stars > 5) {
            throw new ErrorHandler("Validation error", 400, {
                review: "Review text is required",
                stars: "Stars must be an integer from 1 to 5"
            });
        }

        existingReview.review = review;
        existingReview.stars = stars;
        await existingReview.save();

        return res.json(existingReview);
    } catch (error) {
        next(error);
    }
});

//  Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await Review.findByPk(reviewId);
        if (!review) throw new ErrorHandler("Review couldn't be found", 404);

        if (review.userId !== userId) throw new ErrorHandler("Forbidden", 403);

        await review.destroy();

        return res.json({ message: "Successfully deleted" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
