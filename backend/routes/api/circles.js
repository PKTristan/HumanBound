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
router.get('/:id', restoreUser, requireAuth, async (req, res, next) => {
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


const validateCircle = [
    check('name')
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ min: 1, max: 50 })
        .withMessage('Circle name must be between 1 and 50 characters.'),
    check('currentBook')
        .exists({ checkFalsy: true })
        .isInt()
        .withMessage('Current book must be an integer.'),
    handleValidationErrors
];


//create a circle
router.post('/', restoreUser, requireAuth, validateCircle, async (req, res, next) => {
    const { name, currentBook } = req.body;
    const { id } = req.user;

    const book = await Book.findByPk(currentBook);

    if (!book) {
        const err = new Error('Not a valid book choice');
        err.title = 'Not a valid book choice';
        err.status = 404;
        err.errors = { book: 'Not a valid book choice' };
        return next(err);
    }

    const circle = await Circle.create({
        creator: id,
        name,
        currentBook
    }).catch(err => next(err));


    return res.json({ circle });
});


//if the book is updated then it adds a new current book
const addPrevBook = async(circleId, currentBook, next) => {
    const circle = await Circle.findByPk(circleId).catch(err => next(err));

    if (!circle) {
        const err = new Error('No circle found');
        err.title = 'No circle found';
        err.status = 404;
        err.errors = { circle: 'No circle found' };
        return next(err);
    }


    if (circle.currentBook !== currentBook) {
        const prevBook = await PrevBook.create({
            circleId,
            bookId: circle.currentBook
        }).catch(err => next(err));

        if (!prevBook) {
            const err = new Error('No prev book found');
            err.title = 'No prev book found';
            err.status = 404;
            err.errors = { prevBook: 'No prev book found' };
            return next(err);
        }
    }
}


//update a circle
router.put('/:id', restoreUser, requireAuth, validateCircle, async (req, res, next) => {
    const { id } = req.params;
    const { name, currentBook } = req.body;

    const book = await Book.findByPk(currentBook);

    if (!book) {
        const err = new Error('Not a valid book choice');
        err.title = 'Not a valid book choice';
        err.status = 404;
        err.errors = { book: 'Not a valid book choice' };
        return next(err);
    };

    await addPrevBook(id, currentBook, next).catch(err => next(err));

    const [updated] = await Circle.update({
        name,
        currentBook
    }, { where: { id } }).catch(err => next(err));

    if(updated) {
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
    }

    return res.json({ update: "unsuccessful" });
})

module.exports = router;
