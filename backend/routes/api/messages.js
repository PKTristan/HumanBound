const express = require('express')
const router = express.Router();

const { restoreUser, requireAuth } = require('../../utils/auth');
const { addId } = require('../../utils/reference.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { Message } = require('../../db/models');

const validateMessage = [
    check('message')
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ min: 1, max: Infinity })
        .withMessage('Please provide a message at least one character long.'),

        handleValidationErrors
];

//post a message in a circle
router.post('/', restoreUser, requireAuth, validateMessage, async (req, res, next) => {
    const { id: circleId, message } = req.body;
    const { id: userId } = req.user;

    const messageData = await Message.create({
        userId,
        circleId,
        message
    }).catch(err => next(err));

    if (!messageData) {
        const err = new Error('No message found');
        err.title = 'No message found';
        err.status = 404;
        err.errors = { message: 'No message found' };
        return next(err);
    }


    return res.json({ message: messageData });
});


//edit a message user sent
router.put('/:id', restoreUser, requireAuth, validateMessage, async (req, res, next) => {
    const { id } = req.params;
    const { message } = req.body;

    const [updated] = await Message.update({
        message
    }, {where: {id}}).catch(err => next(err));

    if (!updated) {
        const err = new Error('No message found');
        err.title = 'No message found';
        err.status = 404;
        err.errors = { message: 'No message found' };
    }

    return res.json({ updated: (updated) ? 'succesfully updated' : 'failed to update' });
});



//delete a message
router.delete('/:id', restoreUser, requireAuth, async (req, res, next) => {
    const { id } = req.params;

    const deleted = await Message.destroy({
        where: {
            id
        }
    }).catch(err => next(err));

    return res.json({ deleted: (deleted) ? 'successfully deleted' : 'failed to delete' });
});

module.exports = router;
