const express = require('express');
const { ReviewImage, Review } = require('../../db/models');
const router = express.Router();

//POST Add an Image to a Review based on the Review's id
router.post('/reviews/:reviewId/images', async (req, res, next) => {
    const {reviewId} = req.params;
    const {url} = req.body;

    try {
        if(!url){
            throw new Error('URL is required');
        }

        const review = await Review.findByPk(reviewId);
        if(!review){
            throw new Error('Review not found');
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
            throw new Error('Review Image not found');
        }

        await reviewImageToDelete.destroy();
        return res.json({ message: 'Review Image successfully deleted' });
    }catch(error){
        next(error);
    }
});

// Error handling middleware
router.use((err, req, res, next) => {
    const errorMessage = err.message;
    res.status(500);
    return res.json({
        message: errorMessage,
        status: res.status,
    });
});

module.exports = router;