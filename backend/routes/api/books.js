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

    return res.json({ books });
});



//get book details by id
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    const book = await Book.findByPk(id, {
        include: {
            model: Review,
            attributes: [ 'id', 'userId', 'review'],
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

    return res.json({ book });
});


module.exports = router;
