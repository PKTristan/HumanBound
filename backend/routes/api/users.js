// backend/routes/api/users.js
const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User } = require('../../db/models');

router.post('/', async (req, res, next) => {
    const { firstName, lastName, email, username, password, avi } = req.body;

    if (!password) {
        const err = new Error('Password is required');
        err.status = 400;
        err.title = 'Password is required';
        err.errors = { password: 'Password is required' };
        return next(err);
    }

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
        lastName: user.lastName
    };

    setTokenCookie(res, safeUser);

    return res.json({ user: safeUser });
});

module.exports = router;
