const express = require('express')
const router = express.Router();

const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { Circle, User, Book, Message, PrevBook } = require('../../db/models');


//get all circles
router.get('/', async (req, res, next) => {
    const circles = await Circle.findAll({
        include: [
            {
                model: User,
                attributes: ['id', 'username']
            },
            {
                model: Book,
                attributes: ['id', 'title', 'thumbnail']
            }
        ]
    }).catch(err => next(err));

    if (!circles || !circles.length) {
        const err = new Error('No circles found');
        err.title = 'No circles found';
        err.status = 404;
        err.errors = { circles: 'No circles found' };
        return next(err);
    };

    return res.json({ circles });
});



//gte all users circles
router.get('/mine', restoreUser, requireAuth, async (req, res, next) => {
    const { id } = req.user;

    const circles = await Circle.findAll({
        where: {
            creator: id
        },
        include: {
            model: Book,
            attributes: ['id', 'title', 'thumbnail']
        }

    }).catch(err => next(err));

    if (!circles || !circles.length) {
        const err = new Error('No circles found');
        err.title = 'No circles found';
        err.status = 404;
        err.errors = { circles: 'No circles found' };
        return next(err);
    };

    return res.json({ circles });
});


//get by id
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    const circle = await Circle.findByPk(id, {
        include: [
            {
                model: User,
                attributes: ['id', 'username']
            },
            {
                model: Book
            },
            {
                model: PrevBook,
                include: {
                    model: Book,
                    attributes: ['id', 'title', 'thumbnail']
                }
            },
            {
                model: Message,
                include: {
                    model: User,
                    attributes: ['id', 'username']
                }
            }
        ]
    }).catch(err => next(err));

    if (!circle) {
        const err = new Error('No circle found');
        err.title = 'No circle found';
        err.status = 404;
        err.errors = { circle: 'No circle found' };
        return next(err);
    }

    return res.json({ circle });
});

module.exports = router;
