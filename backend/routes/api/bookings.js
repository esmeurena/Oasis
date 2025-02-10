const express = require('express');
const { Booking, Spot } = require('../../db/models');
const { ErrorHandler } = require('../../utils/errorHandler');
const router = express.Router();
const { Op } = require('sequelize');

// GET all bookings of the current user
router.get('/current', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.findAll({ where: { userId } });
        return res.json(bookings);
    } catch (error) {
        next(error);
    }
});

// GET all bookings for a spot by spotId
router.get('/:spotId/bookings', async (req, res, next) => {
    try {
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            throw new ErrorHandler("Spot not found", 404);
        }
        const bookings = await Booking.findAll({ where: { spotId } });
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

        // Validate dates
        const errors = {};
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

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

        const spot = await Spot.findByPk(spotId);
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
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new ErrorHandler("Booking not found", 404);
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
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new ErrorHandler("Booking not found", 404);
        }
        await booking.destroy();
        return res.json({ message: "Booking successfully deleted" });
    } catch (error) {
        next(error);
    }
});



module.exports = router;
