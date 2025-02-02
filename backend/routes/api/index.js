
// GET /api/restore-user

//express imports
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
//sequelize imports
const { User } = require('../../db/models');

//middleware imports
const { restoreUser, setTokenCookie, requireAuth} = require('../../utils/auth.js');


//Middleware
router.use(restoreUser);

//Routes for API
router.use('/session', sessionRouter);

router.use('/users', usersRouter);


router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
  });


module.exports = router;