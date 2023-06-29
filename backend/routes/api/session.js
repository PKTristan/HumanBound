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

    if (!user || !(bcrypt.compareSync(password, user.password.toString()))) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'the provided credentials are incorrect' };
        return next(err);
    }

    const safeUser = {
        id: user.id,
        avi: user.avi,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    };


    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});


//log out
router.delete('/', (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});


//get current user
router.get('/', restoreUser, requireAuth, async (req, res, next) => {
    const { id } = req.user;

    const user = await User.findByPk(id);


    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        err.title = 'User not found';
        err.errors = { error: 'User not found' };
        return next(err);
    }

    const safeUser = {
        id: user.id,
        avi: user.avi,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    };

    res.json({ user: safeUser });
});

module.exports = router;
