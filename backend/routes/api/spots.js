const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Security Imports
const { setTokenCookie, restoreUser } = require('../../utils/auth');

//Utilities
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// Sequelize Imports 
// const { Spot } = require('../../db/models');


const router = express.Router();

// Spot GET Method 
router.get('/',async (req,res,next)=>{
    return res.json("hello there")
});


router.get('/current',async (req,res,next)=>{
    return res.json("hello there")
});

router.get('/:spotid',async (req,res,next)=>{
    return res.json("hello there")
});

router.get('/:spotid/reviews',async (req,res,next)=>{
    return res.json("hello there")
});

// Spot POST Method 

router.post('/',async (req,res,next)=>{
    return res.json("hello there")
});

router.post('/:spotId/images',async (req,res,next)=>{
    return res.json("hello there")
});

router.post('/:spotid/reviews',async (req,res,next)=>{
    return res.json("hello there")
});


// Spots PUT Method
router.put('/:spotId',async (req,res,next)=>{
    return res.json("hello there")
});
router.delete('/',async (req,res,next)=>{
    return res.json("hello there")
});


module.exports = router;