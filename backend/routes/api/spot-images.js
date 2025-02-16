const express = require('express');
const { Op } = require('sequelize');
// Security Imports
const { setTokenCookie, restoreUser } = require('../../utils/auth');
//Utilities
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// Sequelize Imports 
const { SpotImage, Spots} = require('../../db/models');
const { ErrorHandler } = require('../../utils/errorHandler');
const router = express.Router();

//PROTECT INCOMING DATA FOR THE Create Spots ROUTE

router.delete('/:imageId', async (req, res, next) => {
    try {
        const imageId = req.params.imageId;
        const imageToDelete = SpotImage.findByPk(imageId)
        console.log(imageId)
        return res.json(imageToDelete)

    } catch (error) {
        next(error)
    }
});
module.exports = router;