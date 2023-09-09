const express = require('express')
const router = express.Router();

const { restoreUser, requireAuth } = require('../../utils/auth');
const { addId, getLikeOperator } = require('../../utils/reference.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Book, User, Review } = require('../../db/models');

const reviewRouter = require('./reviews.js');

const valPermission = async (req, res, next) => {
    const { admin } = req.user;

    if (!admin) {
        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.status = 401;
        err.errors = { admin: 'Unauthorized' };
        return next(err);
    }

    return next();
};


router.use('/:id/reviews', addId, reviewRouter);

router.get('/', async (req, res, next) => {
    const { author, title } = req.query;

    const queryOptions = {
        attributes: ['id', 'title', 'thumbnail', 'authors', 'synopsis'],
        where: {},
    };


    if (author) {
        queryOptions.where.authors = {
                [getLikeOperator()]: `%${author}%`,
            };
    }

    if (title) {
        queryOptions.where.title = {
                [getLikeOperator()]: `%${title}%`,
        };
    }

    const books = await Book.findAll(queryOptions).catch(err => next(err));

    if (!books || !books.length) {
        const err = new Error('No books found');
        err.title = 'No books found';
        err.status = 404;
        err.errors = { books: 'No books found' };
        return next(err);
    }

    books.forEach(book => {
        book.authors = book.authors.split(',');
    });

    return res.json({ books });
});



//get book details by id
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    const book = await Book.findByPk(id, {
        include: {
            model: Review,
            attributes: ['id', 'userId', 'review'],
            include: {
                model: User,
                attributes: ['id', 'username', 'avi'],
            }
        }
    }).catch(err => next(err));

    if (!book) {
        const err = new Error('No book found');
        err.title = 'No book found';
        err.status = 404;
        err.errors = { book: 'No book found' };
        return next(err);
    }


    book.authors = book.authors.split(',');


    return res.json({ book });
});



const validateBook = [
    check('title')
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ min: 1, max: 50 })
        .withMessage('Please provide a title of max 50 characters.'),
    check('authors')
        .exists({ checkFalsy: true })
        .custom(value => Array.isArray(value) && value.length > 0)
        .withMessage('Please provide 1 or multiple authors.'),
    check('synopsis')
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ min: 20, max: Infinity })
        .withMessage('Please provide a synopsis/summary of at least 20 words long.'),

    // Optional fields
    check('subtitle')
        .optional()
        .isString()
        .isLength({ max: 50 })
        .withMessage('Subtitle must be a string with a maximum length of 50 characters.'),
    check('pdfLink')
        .optional()
        .isString()
        .isURL()
        .withMessage('Please provide a valid PDF link.'),
    check('thumbnail')
        .optional()
        .isString()
        .isURL()
        .withMessage('Please provide a valid thumbnail URL.'),
    check('pageCount')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Page count must be zero or greater.'),
    check('publishYear')
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage('Publish year must be a valid year after 1000.'),


    handleValidationErrors
];


//create a new book
router.post('/', requireAuth, validateBook, async (req, res, next) => {
    const { title, subtitle, authors, pdfLink, thumbnail, pageCount, publishYear, synopsis } = req.body;

    const authStr = authors.join(',');

    const book = await Book.create({
        title,
        subtitle,
        authors: authStr,
        pdfLink,
        thumbnail,
        pageCount,
        publishYear,
        synopsis
    }).catch(err => next(err));

    return res.json({ book });
});


//edit book details
router.put('/:id', requireAuth, valPermission, validateBook, async (req, res, next) => {
    const { id } = req.params;

    const { title, subtitle, authors, pdfLink, thumbnail, pageCount, publishYear, synopsis } = req.body;

    const authStr = authors.join(',');

    const [updated] = await Book.update({
        title,
        subtitle,
        authors: authStr,
        pdfLink,
        thumbnail,
        pageCount,
        publishYear,
        synopsis
    }, { where: { id } }).catch(err => next(err));

    if (updated) {
        const book = await Book.findByPk(id, {
            include: {
                model: Review,
                attributes: ['id', 'userId', 'review'],
                include: {
                    model: User,
                    attributes: ['id', 'username', 'avi'],
                }
            }
        }).catch(err => next(err));

        if (!book) {
            const err = new Error('No book found');
            err.title = 'No book found';
            err.status = 404;
            err.errors = { book: 'No book found' };
            return next(err);
        }


        book.authors = book.authors.split(',');

        return res.json({ book });
    }

    return res.json({update: 'unsuccessful'});
});

router.delete('/:id', restoreUser, requireAuth, valPermission, async (req, res, next) => {
    const { id } = req.params;

    const deleted = await Book.destroy({ where: { id } }).catch(err => next(err));

    return res.json({ deleted: (deleted) ? 'successful' : 'unsuccessful' });
});


module.exports = router;
