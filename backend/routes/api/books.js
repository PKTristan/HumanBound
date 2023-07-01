const express = require('express')
const router = express.Router();

const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { Book, User, Review } = require('../../db/models');



function getLikeOperator() {
    // Check the environment here
    const isPostgres = process.env.NODE_ENV === 'production';

    // Use appropriate operator based on environment
    return isPostgres ? Op.iLike : Op.like;
}


router.get('/', async (req, res, next) => {
    const { author, title } = req.query;

    const queryOptions = {
        attributes: ['id', 'title', 'thumbnail', 'authors', 'synopsis'],
    };


    if (author) {
        queryOptions.where = {
            authors: {
                [getLikeOperator()]: `%${author}%`,
            },
        };
    }

    if (title) {
        queryOptions.where = {
            title: {
                [getLikeOperator()]: `%${title}%`,
            },
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
                attributes: ['username'],
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
        .isLength({ min: 1, max: 30 })
        .withMessage('Please provide a title.'),
    check('authors')
        .exists({ checkFalsy: true })
        .custom(value => Array.isArray(value) && value.length > 0)
        .withMessage('Please provide 1 or multiple authors in an array.'),
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
        .isInt({ min: 1 })
        .withMessage('Page count must be a positive integer.'),
    check('publishYear')
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage('Publish year must be a valid year.'),


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
router.put('/:id', requireAuth, validateBook, async (req, res, next) => {
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
                    attributes: ['username'],
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


module.exports = router;
