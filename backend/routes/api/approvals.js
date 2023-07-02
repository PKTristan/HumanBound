const express = require('express')
const router = express.Router();

const { restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { Approval } = require('../../db/models');

const validateApproval = [
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



//get all approvals
router.get('/', restoreUser, requireAuth, async (req, res, next) => {

    //get the pending approvals first
    const pending = await Approval.findAll({
        where: {
            status: 'pending'
        },
        order: [
            ['createdAt', 'ASC']
        ]
    }).catch(err => next(err));

    //then get the acknowledged ones
    const rest = await Approval.findAll({
        where: {
            status: {
                [Op.not]: 'pending'
            }
        },
        order: [
            ['createdAt', 'DESC']
        ]
    }).catch(err => next(err));


    //split the authors
    pending.forEach(approval => approval.authors = approval.authors.split(','));
    rest.forEach(approval => approval.authors = approval.authors.split(','));

    //combine into an object
    const approvals = {pending: [...pending], acknowledged: [...rest] };



    return res.json({approvals});
});


module.exports = router;
