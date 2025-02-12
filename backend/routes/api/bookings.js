const express = require('express');
const { Booking, Spot } = require('../../db/models');
const { ErrorHandler } = require('../../utils/errorHandler');
const router = express.Router();
const { Op } = require('sequelize');

// GET all bookings of the current user
router.get('/current', async (req, res, next) => {
    try {
        if(!req.user || !req.user.id){
            throw new ErrorHandler("Authentication required", 401);
        }
        const userId = req.user.id;
        const bookings = await Booking.findAll({ where: { userId } });

        if(bookings.length === 0){
            throw new ErrorHandler("No bookings found for the current user", 404);
        }

        return res.json(bookings);
    } catch (error) {
        next(error);
    }
});

// GET all bookings for a spot by spotId
router.get('/:spotId/bookings', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const userId = req.user.id;

        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            throw new ErrorHandler("Spot not found", 404);
        }

        if (spot.userId !== userId) {
            throw new ErrorHandler("You are not authorized to view bookings for this spot", 403);
        }

        const bookings = await Booking.findAll({ where: { spotId } });

        if(bookings.length === 0){
            throw new ErrorHandler("No bookings found for this spot", 404);
        }

        return res.json(bookings);
    } catch (error) {
        next(error);
    }
});

// POST create a booking for a spot by spotId
router.post('/spots/:spotId/bookings', async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body;
        const spotId = req.params.spotId;
        const userId = req.user.id;
        const spot = await Spot.findByPk(spotId);

        // Validate dates
        const errors = {};
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if(spot.userId === userId){
            throw new ErrorHandler("You cannot book your own spot", 403);
        }

        if(!spot || spot.isAvailable === false){
            throw new ErrorHandler("Spot is not available", 400);
        }
        if(isNaN(Date.parse(startDate))){
            errors.startDate = "Invalid start date format";
        }
        if(isNaN(Date.parse(endDate))){
            errors.endDate = "Invalid end date format";
        }

        if (start < now) {
            errors.startDate = "startDate cannot be in the past";
        }
        if (end <= start) {
            errors.endDate = "endDate cannot be on or before startDate";
        }



        if (Object.keys(errors).length > 0) {
            throw new ErrorHandler("Bad Request", 400, errors);
        }

        // Check for booking conflicts
        const existingBooking = await Booking.findOne({
            where: {
                spotId,
                [Op.or]: [
                    {
                        startDate: {
                            [Op.between]: [startDate, endDate]
                        }
                    },
                    {
                        endDate: {
                            [Op.between]: [startDate, endDate]
                        }
                    }
                ]
            }
        });

        if (existingBooking) {
            throw new ErrorHandler("Sorry, this spot is already booked for the specified dates", 403, {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            });
        }

        //const spot = await Spot.findByPk(spotId);
        if (!spot) {
            throw new ErrorHandler("Spot not found", 404);
        }
        const newBooking = await Booking.create({ spotId, userId, startDate, endDate });
        return res.status(201).json(newBooking);
    } catch (error) {
        next(error);
    }
});

// PUT update a booking by bookingId
router.put('/:bookingId', async (req, res, next) => {
    try {
        const bookingId = req.params.bookingId;
        const { startDate, endDate } = req.body;
        const userId = req.user.id;

        // Validate dates
        const errors = {};

        if(!bookingId){
            throw new ErrorHandler("BookingId not found", 404);
        }

        if(isNaN(Date.parse(startDate))){
            errors.startDate = "Invalid start date format";
        }
        if(isNaN(Date.parse(endDate))){
            errors.endDate = "Invalid end date format";
        }
        if(start < now){
            errors.startDate = "startDate cannot be in the past";
        }
        if(end <= start){
            errors.endDate = "endDate cannot be on or before startDate";
        }

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new ErrorHandler("Booking not found", 404);
        }

        if(booking.userId !== userId){
            throw new ErrorHandler("You are not authorized to update this booking", 403);
        }

        if (Object.keys(errors).length > 0) {
            throw new ErrorHandler("Bad Request", 400, errors);
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
