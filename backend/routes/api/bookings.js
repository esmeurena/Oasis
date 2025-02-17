const express = require('express');
const { Booking, Spot } = require('../../db/models');
const { ErrorHandler } = require('../../utils/errorHandler');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');
const router = express.Router();
const { Op } = require('sequelize');

const validateBooking = [
    check("startDate")
        .exists({checkFalsy: true})
        .isString()
        .withMessage("Start Date needs to be a string."),
    check("endDate")
        .exists({checkFalsy: true})
        .isString()
        .withMessage("End Date needs to be a string."),
    handleValidationErrors
];

// GET all bookings of the current user
router.get('/current', async (req, res, next) => {
    try {
        const currUser = req.user.id
        const userSpot = await Booking.findAll({
            where: {
                userId: currUser
            },
            include:[{
                model: Spot
            }]
        });
        if(!req.user){
            throw new ErrorHandler("No User Logged in.");
        }
        if(!userSpot[0]){
            throw new ErrorHandler("No bookings for this User")
        }

        return res.json(userSpot);
    } catch (error) {
        next(error);
    }
});



// PUT update a booking by bookingId
router.put('/:bookingId',validateBooking, async (req, res, next) => {
    try {
        const bookingId = req.params.bookingId;
        const { startDate, endDate } = req.body;
        const userId = req.user.id;

        

        if(!bookingId){
            throw new ErrorHandler("BookingId not found", 404);
        }

        if(isNaN(Date.parse(startDate))){
            throw new ErrorHandler ("Invalid start date format",403);
        }
        if(isNaN(Date.parse(endDate))){
            throw new ErrorHandler("Invalid end date format",403);
        }
        
        if(Date.parse(startDate) < Date.now()){
            throw new ErrorHandler("startDate cannot be in the past",403);
        }
        if(Date.parse(endDate) <= Date.parse(startDate)){
            throw new ErrorHandler("endDate cannot be on or before startDate",403);
        }

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new ErrorHandler("Booking not found", 404);
        }

        if(booking.userId !== userId){
            throw new ErrorHandler("You are not authorized to update this booking", 403);
        }
        const bookings = await Booking.findAll({
            where:{
                id:bookingId
            }
    });
        for(let book of bookings){
            const bookBody = book.toJSON()
            if(Date.parse(startDate) === Date.parse(bookBody.startDate)){
                throw new ErrorHandler("This start date is already booked")
            };
            if(Date.parse(endDate) === Date.parse(bookBody.endDate)){
                throw new ErrorHandler("This end date is already taken")
            }
            if(Date.parse(startDate) >= Date.parse(bookBody.startDate) && Date.parse(endDate) <= Date.parse(bookBody.endDate) ){
                throw new ErrorHandler("These dates are already being booked",403)
            }
        }
        await booking.update({ startDate, endDate });
        return res.json(booking);
    } catch (error) {
        next(error);
    }
});

// DELETE a booking by bookingId
router.delete('/:bookingId', async (req, res, next) => {
    try {
        const bookingId = req.params.bookingId;
        const userId = req.user.id;

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new ErrorHandler("Booking not found", 404);
        }

        if(booking.userId !== userId){
            throw new ErrorHandler("You are not authorized to delete this booking", 403);
        }

        await booking.destroy();
        return res.json({ message: "Booking successfully deleted" });
    } catch (error) {
        next(error);
    }
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             



module.exports = router;
