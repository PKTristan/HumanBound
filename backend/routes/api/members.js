const express = require('express')
const router = express.Router();

const { restoreUser, requireAuth } = require('../../utils/auth');
const { addId } = require('../../utils/reference.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { Member, User } = require('../../db/models');


// get all members of a circle
router.get('/', restoreUser, requireAuth, async (req, res, next) => {
    const { id } = req.body;

    const members = await Member.findAll({
        where: {
            circleId: id
        },
        include: {
            model: User,
            attributes: ['id', 'username', 'avi']
        }
    }).catch(err => next(err));

    if (!members || !members.length) {
        const err = new Error('No members found');
        err.title = 'No members found';
        err.status = 404;
        err.errors = { members: 'No members found' };
        return next(err);
    }

    return res.json({ members });
});


// create a membership request
router.post('/', restoreUser, requireAuth, async (req, res, next) => {
    const { id: circleId } = req.body;
    const {id: userId} = req.user;

    const hasPendingRequest = await Member.findAll({
        where: {
            circleId,
            userId,
            status: 'pending'
        }
    }).catch(err => next(err));

    if (hasPendingRequest.length) {
        const err = new Error('Request already pending');
        err.title = 'Member already pending';
        err.status = 400;
        err.errors = { members: 'Member already pending' };
        return next(err);
    }

    const request = await Member.create({
        circleId,
        userId,
        status: 'pending'
    }).catch(err => next(err));

    if (!request) {
        const error = new Error('Could not create request');
        error.title = 'Could not create request';
        error.status = 500;
        return next(error);
    }

    return res.json({ request });
});

const validateMember = [
    check('status')
        .exists({ checkFalsy: true })
        .isIn(['member', 'host'])
        .withMessage('Status must be member or host'),

    handleValidationErrors
];


//edit a membership request
router.put('/:id', restoreUser, requireAuth, validateMember, async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const [updated] = await Member.update(
        { status }, { where : { id }}
    ).catch(err => next(err));

    if (!updated) {
        const err = new Error('No request found');
        err.title = 'No request found';
        err.status = 404;
        err.errors = { request: 'No request found' };
        return next(err);
    }

    return res.json({ updated: (updated) ? 'succesfully updated' : 'failed to update' });
});


//delete a membership request
router.delete('/:id', restoreUser, requireAuth, async(req, res, next) => {
    const { id } = req.params;

    const deleted = await Member.destroy({
        where: {
            id
        }
    }).catch(err => next(err));

    return res.json({ deleted: (deleted) ? 'succesfully deleted' : 'failed to delete' });
});


module.exports = router;
