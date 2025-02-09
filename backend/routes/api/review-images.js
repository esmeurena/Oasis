const express = require('express');
const { ReviewImage, Review } = require('../../db/models');
const { ErrorHandler } = require('../../utils/errorHandler');
const { requireAuth } = require('../../utils.auth');
const router = express.Router();

// POST add an image to a review
router.post('/reviews/:reviewId/images', requireAuth, async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { url } = req.body;
        const userId = req.user.id;

        const review = await Review.findByPk(reviewId);
        if (!review) {
            throw new ErrorHandler("Review couldn't be found", 404);
        }

        // Check if review belongs to current user
        if (review.userId !== userId) {
            throw new ErrorHandler("Forbidden", 403);
        }

        // Check number of existing images
        const imageCount = await ReviewImage.count({ where: { reviewId } });
        if (imageCount >= 10) {
            throw new ErrorHandler("Maximum number of images for this resource was reached", 403);
        }

        const newReviewImage = await ReviewImage.create({ reviewId, url });
        return res.json({
            id: newReviewImage.id,
            url: newReviewImage.url
        });
    } catch (error) {
        next(error);
    }
});

// DELETE a review image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    try {
        const { imageId } = req.params;
        const userId = req.user.id;

        const reviewImage = await ReviewImage.findByPk(imageId, {
            include: Review
        });

        if (!reviewImage) {
            throw new ErrorHandler("Review Image couldn't be found", 404);
        }

        // Check if the review belongs to the current user
        if (reviewImage.Review.userId !== userId) {
            throw new ErrorHandler("Forbidden", 403);
        }

        await reviewImage.destroy();
        return res.json({ message: "Successfully deleted" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;