// backend/routes/api/users.js
const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { User } = require('../../db/models');

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
    check('firstName')
        .exists({ checkFalsy: true })
        .isLength({min: 1, max: 20})
        .withMessage('Please provide a first name between 1 and 20 characters.'),
    check('lastName')
        .exists({ checkFalsy: true})
        .isLength({ min: 1, max: 20 })
        .withMessage('Please provide a last name between 1 and 20 characters.'),
    handleValidationErrors
];

router.post('/', validateSignup, async (req, res, next) => {
    const { firstName, lastName, email, username, password, avi } = req.body;

    const user = await User.create({
        firstName,
        lastName,
        email,
        username,
        password: bcrypt.hashSync(password),
        avi,
        admin: false
    }).catch(err => {
        return next(err);
    });

    const safeUser = {
        id: user.id,
        avi: user.avi,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        admin: user.admin
    };

    setTokenCookie(res, safeUser);

    return res.json({ user: safeUser });
});

module.exports = router;
