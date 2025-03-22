const express = require('express');
const { Booking, Spot } = require('../../db/models');
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

        


        const booking = await Booking.findByPk(bookingId);

        const bookings = await Booking.findAll({
            where:{
                id:bookingId
            }
    });
        for(let book of bookings){
            const bookBody = book.toJSON()
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

        await booking.destroy();
        return res.json({ message: "Booking successfully deleted" });
    } catch (error) {
        next(error);
    }
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             



module.exports = router;
