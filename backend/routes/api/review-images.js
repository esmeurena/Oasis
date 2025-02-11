const express = require('express');
const { ReviewImage, Review } = require('../../db/models');
const { ErrorHandler } = require('../../utils/errorHandler');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

//DELETE Delete a Review image by its ID
router.delete('/:reviewImageId', async (req, res, next) => {
    //const { reviewImageId } = req.params;
    try {
        const reviewImageId = req.params.reviewImageId;
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

module.exports = router;