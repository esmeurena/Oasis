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

const router = express.Router();

// Spot GET Method 
router.get('/', async (req, res, next) => {
    try {

        const spots = await Spot.findall();

        if (spots) {
            return res.json(spots)
        } else {
            throw new Error("No Spots Found")
        }

    } catch (error) {
        next(error)
    }
});


router.get('/current', async (req, res, next) => {
    try {
        const currentUser = await req.body.ownerId
        console.log(currentUser)
        
        const userSpots = await Spot.findall({
            where: {
                id: currentUser
            },
            
        }
        )
        
    } catch (error) {
        next(error)
    }
});

router.get('/:spotid', async (req, res, next) => {
    try {
        const spotId = req.params.id;

        const spot = await Spot.findByPk(spotId);

        if(spot){
            return res.json(spot)
        }
    } catch (error) {
        next(error)
    }
});

router.get('/:spotid/reviews', async (req, res, next) => {
    const spotId = req.params.id;
    const spot = await Spot.findByPk(spotId);

    return res.json("hello there")
});

// Spot POST Method 

router.post('/', async (req, res, next) => {
    try {
        const {address, city, state, country, lat, lang, name, description, price, previewImage} = req.body
        
        if(!address|| !city|| !state|| !country|| !lat|| !lang|| !name|| !price|| !previewImage){
            throw new Error("please check your data entered")
        }else{
            const newSpot = await Spot.create({address, city, state, country, lat, lang, name, description, price, previewImage});
            return res.json(newSpot)
        }
    } catch (error) {
        next(error)
    }
});

router.post('/:spotId/images', async (req, res, next) => {
    return res.json("hello there")
});

router.post('/:spotid/reviews', async (req, res, next) => {
    return res.json("hello there")
});


// Spots PUT Method
router.put('/:spotId', async (req, res, next) => {
    try {
        const spotId = req.params.id;
        const {address, city, state, country, lat, lang, name, description, price, previewImage} = req.body;

        const spotToUpdate = await Spot.findByPk(spotId);
        if(!spotToUpdate){
            throw new Error("no user to be found")
        }else{
            spotToUpdate.update({address, city, state, country, lat, lang, name, description, price, previewImage})
            return res.json({spot: spotToUpdate})
        }
    } catch (error) {
        next(error)
    }
});
router.delete('/', async (req, res, next) => {
    try {
        const spotId = req.params.id

        const spotToDelete = await Spot.findByPk(spotId);
        if(spotToDelete){
            const deletedSpot = await spotToDelete.destroy();
            return res.json({deletedSpot})
        }else{
            throw new Error("No spot found with provided ID")
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