const express = require('express')
const router = express.Router();

const { restoreUser, requireAuth } = require('../../utils/auth');
const { addId } = require('../../utils/reference.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { Message, Circle, Member, User } = require('../../db/models');

const editDelPermissions = async (req, res, next) => {
    const { id } = req.params;
    const { id: userId, admin } = req.user;


    const message = await Message.findByPk(id).catch(err => next(err));

    if (!message) {
        const err = new Error('No message found');
        err.title = 'No message found';
        err.status = 404;
        err.errors = { message: 'No message found' };
        return next(err);
    }

    const { circleId } = message;
    const circle = await Circle.findByPk(circleId).catch(err => next(err));

    if (!circle) {
        const err = new Error('No circle found');
        err.title = 'No circle found';
        err.status = 404;
        err.errors = { circle: 'No circle found' };
        return next(err);
    }

    if (circle.creator !== userId && message.userId !== userId && !admin) {
        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.status = 403;
        err.errors = { message: 'Unauthorized' };
        return next(err);
    }


    return next();
}

const validateMessage = [
    check('message')
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ min: 1, max: Infinity })
        .withMessage('Please provide a message at least one character long.'),

        handleValidationErrors
];

router.get('/', restoreUser, requireAuth, async (req, res, next) => {
    const { id: userId, admin } = req.user;
    const {id: circleId} = req.body;


    const [member] = await Member.findAll({ where: { circleId, userId } }).catch(err => next(err));

    if (!admin && (!member || member.status === 'pending')) {
        const err = new Error('No permission to view members of this group');
        err.title = 'No permission to view members of this group';
        err.status = 403;
        err.errors = { member: 'No permission to view members of this group' };
        return next(err);
    }

    const messages = await Message.findAll({
        include: {
            model: User,
            attributes: ['id', 'username', 'avi']
        },
        where: {
            circleId
        },
        order: [
            ['createdAt', 'ASC']
        ]
    }).catch(err => next(err));

    return res.json({messages});
});

//post a message in a circle
router.post('/', restoreUser, requireAuth, validateMessage, async (req, res, next) => {
    const { id: circleId, message } = req.body;
    const { id: userId, admin } = req.user;

    const [member] = await Member.findAll({
        where: {
            userId,
            circleId
        }
    }).catch(err => next(err));

    if (!admin && (!member || member.status === 'pending')) {
        const err = new Error('Member not found');
        err.title = 'Member not found';
        err.status = 404;
        err.errors = { member: 'non members cant post in this circle' };
        return next(err);
    }

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
router.put('/:id', restoreUser, requireAuth, editDelPermissions, validateMessage, async (req, res, next) => {
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
router.delete('/:id', restoreUser, requireAuth, editDelPermissions, async (req, res, next) => {
    const { id } = req.params;

    const deleted = await Message.destroy({
        where: {
            id
        }
    }).catch(err => next(err));

    return res.json({ deleted: (deleted) ? 'successfully deleted' : 'failed to delete' });
});

module.exports = router;
