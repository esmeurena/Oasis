const express = require('express');
const { ReviewImage, Review } = require('../../db/models');
const { ErrorHandler } = require('../../utils/errorHandler');
const router = express.Router();

//POST Add an Image to a Review based on the Review's id
router.post('/reviews/:reviewId/images', async (req, res, next) => {
    const {reviewId} = req.params;
    const {url} = req.body;

    try {
        if(!url){
            throw new ErrorHandler('URL is required', 400);
        }

        const review = await Review.findByPk(reviewId);
        if(!review){
            throw new ErrorHandler('Review not found', 404);
        }

        const newReviewImage = await ReviewImage.create({
            reviewId,
            url,
        });

        return res.json(newReviewImage);
    }catch(error){
        next(error);
    }
});

//DELETE Delete a Review image by its ID
router.delete('/:reviewImageId', async (req, res, next) => {
    const { reviewImageId } = req.params;

    try {
        const reviewImageToDelete = await ReviewImage.findByPk(reviewImageId);
        if(!reviewImageToDelete){
            throw new ErrorHandler('Review Image not found', 404);
        }

        await reviewImageToDelete.destroy();
        return res.json({ message: 'Review Image successfully deleted' });
    }catch(error){
        next(error);
    }
});

// Error handling middleware
router.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "Internal Server Error";
    res.status(statusCode).json({
        message: errorMessage,
        status: statusCode
    });
});

module.exports = router;