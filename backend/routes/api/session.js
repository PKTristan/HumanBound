// backend/routes/api/session.js
const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];

router.post('/', validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential
            }
        }
    });

    if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'the provided credentials are incorrect' };
        return next(err);
    }

    if (!(bcrypt.compareSync(password, user.password.toString()))) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = {password: 'the provided password is incorrect'};

        return next(err);
    }

    const safeUser = {
        id: user.id,
        avi: user.avi,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        admin: user.admin
    };


    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});


//log out
router.delete('/', (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'successfully logged out' });
});


//get current user
router.get('/', async (req, res, next) => {
    const { user } = req;


    if (!user) {
        return res.json({ user: null });
    }

    const safeUser = {
        id: user.id,
        avi: user.avi,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        admin: user.admin
    };

    res.json({ user: safeUser });
});

module.exports = router;
