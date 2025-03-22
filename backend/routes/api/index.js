//express imports
const router = require('express').Router();
const { restoreUser } = require('../../utils/auth');

// Import all route files
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js');
const reviewImagesRouter = require('./review-images.js');
const spotImagesRouter = require('./spot-images.js');

// Apply authentication middleware
router.use(restoreUser);

// Connect all routes
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);
router.use('/bookings', bookingsRouter);
router.use('/review-images', reviewImagesRouter);
router.use('/spot-images', spotImagesRouter);

// For testing purposes

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

// Authentication error handler
/*router.use((req, res, next) => {
    const err = new Error("Authentication required");
    err.status = 401;
    next(err);
});*/

// Error handler

module.exports = router;