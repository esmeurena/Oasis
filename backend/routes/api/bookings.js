const express = require('express');
const { Booking, Spot } = require('../../db/models');
const { ErrorHandler } = require('../../utils/errorHandler');
const router = express.Router();

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
