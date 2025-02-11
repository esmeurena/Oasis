const express = require('express');
const bcrypt = require('bcryptjs');
const { ErrorHandler } = require('../../utils/errorHandler');

//Utils imports
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//Sequelize Imports
const { User } = require('../../db/models');

const router = express.Router();

//PROTECT INCOMING DATA FOR THE SIGNUP ROUTE
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, username } = req.body;
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({ firstName, lastName, email, username, hashedPassword });

        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
    } catch (error) {
        next(error);
    }
});

// GET current user
router.get('/current', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        return res.json(user);
    } catch (error) {
        next(error);
    }
});

// PUT update a user by userId
router.put('/:userId', async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const { firstName, lastName, email, username, password } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        await user.update({ firstName, lastName, email, username, password });
        return res.json(user);
    } catch (error) {
        next(error);
    }
});

// DELETE a user by userId
router.delete('/:userId', async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        await user.destroy();
        return res.json({ message: "User successfully deleted" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;