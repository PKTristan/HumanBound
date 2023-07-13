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
        .isLength({ min: 1, max: 20 })
        .withMessage('Please provide a first name between 1 and 20 characters.'),
    check('lastName')
        .exists({ checkFalsy: true })
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


const validateEdit = [
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
        .optional({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1, max: 20 })
        .withMessage('Please provide a first name between 1 and 20 characters.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1, max: 20 })
        .withMessage('Please provide a last name between 1 and 20 characters.'),
    handleValidationErrors
];


//edit a user
router.put('/', restoreUser, requireAuth, validateEdit, async (req, res, next) => {
    const { id } = req.user;
    const { firstName, lastName, email, username, password, avi, admin } = req.body;
    let updated = null;
    let passUpdated = false;

    if (password) {
        [updated] = await User.update({
            firstName, lastName, email, username, password: bcrypt.hashSync(password), avi
        }, { where: { id } }).catch(err => next(err));

        passUpdated = true;
    }
    else {
        [updated] = await User.update({
            firstName, lastName, email, username, avi
        }, { where: { id } }).catch(err => next(err));
    }

    if (!updated) {
        const err = new Error('Not successfully updated');
        err.title = "Not successfully updated";
        err.status = 500;
        err.errors = { user: 'Not successfully updated' };
    }

    const user = await User.findByPk(id).catch(err => next(err));

    if (!user) {
        const err = new Error('No user found.');
        err.title = "No user found.";
        err.status = 500;
        err.errors = { user: 'No user found.' };
        next(err);
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

    setTokenCookie(res, safeUser);

    return res.json({ user: safeUser, messages: { password: (passUpdated) ? 'password successfully updated' : null } });
});

router.put('/:id', restoreUser, requireAuth, async (req, res, next) => {
    const { id } = req.params;
    const { admin: isAdmin } = req.user;
    const { admin } = req.body;
    let updated = null;

    if (isAdmin) {
        [updated] = await User.update({ admin }, { where: { id } }).catch(err => next(err));
    }
    else {
        const err = new Error('Only admins can preform this action');
        err.title = "Only admins can preform this action";
        err.status = 500;
        err.errors = { user: 'Only admins can preform this action' };
        next(err);
    }

    if (!updated) {
        const err = new Error('Not successfully updated');
        err.title = "Not successfully updated";
        err.status = 500;
        err.errors = { user: 'Not successfully updated' };
        next(err);
    }

    return res.json({ message: `user ${id} is now ${admin ? '' : 'not '}an admin`});
});



module.exports = router;
