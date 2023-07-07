const express = require('express')
const router = express.Router();

const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op, Sequelize } = require('sequelize');

const { Review, User, Reply } = require('../../db/models');


// get all reviews
router.get('/', async (req, res, next) => {
    const { id } = req.body;

    const reviews = await Review.findAll({
        include: [
            {
                model: User,
                attributes: ['id', 'username', 'avi']
            },
            {
                model: Reply,
                attributes: [],
                required: false // Include replies even if there are none
            }
        ],
        where: {
            bookId: id
        },
        attributes: {
            include: [
                [Sequelize.literal('(SELECT COUNT(*) FROM `Replies` WHERE `Replies`.`reviewId` = `Review`.`id`)'), 'replyCount']
            ]
        },
        group: ['Review.id', 'User.id'] // Group by review and user to avoid duplicate rows
    }).catch(err => next(err));

    if (!reviews || !reviews.length) {
        const err = new Error('No reviews found');
        err.title = 'No reviews found';
        err.status = 404;
        err.errors = { reviews: 'No reviews found' };
        return next(err);
    }

    return res.json({ reviews });
});



//get review details and replies
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    const review = await Review.findByPk(id, {
        include: [
            {
                model: User,
                attributes: ['id', 'username', 'avi']
            },
            {
                model: Reply,
                include: {
                    model: User,
                    attributes: ['id', 'username', 'avi']
                }
            }
        ]
    }).catch(err => next(err));

    if (!review) {
        const err = new Error('No review found');
        err.title = 'No review found';
        err.status = 404;
        err.errors = { review: 'No review found' };
        return next(err);
    }


    return res.json({ review });
});


const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ min: 10, max: Infinity })
        .withMessage('Review must be a string larger than 10 characters.'),

    handleValidationErrors
];


//post a review for a book
router.post('/', restoreUser, requireAuth, validateReview, async (req, res, next) => {
    const { id: userId } = req.user;
    const { id: bookId } = req.body;
    const { review } = req.body;

    const reviewData = await Review.create({
        userId,
        bookId,
        review
    }).catch(err => next(err));

    if (!reviewData) {
        const err = new Error('No review found');
        err.title = 'No review found';
        err.status = 404;
        err.errors = { review: 'No review found' };
        return next(err);
    }


    return res.json({ review: reviewData });
});


//edit the review posted by the user
router.put('/:id', restoreUser, requireAuth, validateReview, async (req, res, next) => {
    const { id } = req.params;
    const { review } = req.body;

    const [updated] = await Review.update(
        {
            review
        },
        {
            where: {
                id
            }
        }
    ).catch(err => next(err));


    return res.json({ update: (updated) ? 'successfully updated' : 'failed to update' });
});


module.exports = router;
