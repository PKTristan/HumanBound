// backend/routes/api/session.js
const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

router.post('/', async (req, res, next) => {
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
    }

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});

module.exports = router;
