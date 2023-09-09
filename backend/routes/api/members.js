const express = require('express')
const router = express.Router();

const { restoreUser, requireAuth } = require('../../utils/auth');
const { addId } = require('../../utils/reference.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { Member, User, Circle } = require('../../db/models');


const membershipPermission = async (req, res, next) => {
    const { id } = req.params;
    const { id: userId, admin } = req.user;

    const membership = await Member.findByPk(id).catch(err => next(err));

    if (!membership) {
        const err = new Error('No membership found');
        err.title = 'No membership found';
        err.status = 404;
        err.errors = { membership: 'No membership found' };
        return next(err);
    }

    const currUserMembership = await Member.findAll({ where: { userId, circleId: membership.circleId } }).catch(err => next(err));

    if (!admin && (!currUserMembership || !currUserMembership.length)) {
        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.status = 403;
        err.errors = { membership: 'No membership found for current logged in user.' };
        return next(err);
    }

    if (!admin && currUserMembership[0].status !== 'host') {
        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.status = 403;
        err.errors = { membership: 'Unauthorized' };
        return next(err);
    }

    const circle = await Circle.findByPk(membership.circleId).catch(err => next(err));
    const user = await User.findByPk(membership.userId).catch(err => next(err));

    if (!circle) {
        const err = new Error('No circle found');
        err.title = 'No circle found';
        err.status = 404;
        err.errors = { circle: 'No circle found' };
        return next(err);
    }

    if (!user) {
        const err = new Error('No user found');
        err.title = 'No user found';
        err.status = 404;
        err.errors = { user: 'No user found' };
        return next(err);
    }

    if (circle.creator === user.id || user.admin) {
        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.status = 403;
        err.errors = { circle: 'user cannot be deleted as a member' };
        return next(err);
    }

    return next();
}

// get all members of a circle
router.get('/', restoreUser, requireAuth, async (req, res, next) => {
    const { id } = req.body;
    const { id: userId, admin } = req.user;

    const [member] = await findAll({ where: { circleId: id, userId } }).catch(err => next(err));

    if (!admin && (!member || member.status === 'pending')) {
        const err = new Error('No permission to view members of this group');
        err.title = 'No permission to view members of this group';
        err.status = 403;
        err.errors = { member: 'No permission to view members of this group' };
        return next(err);
    }

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

router.get('/my', restoreUser, requireAuth, async (req, res, next) => {
    const { id: userId } = req.user;

    const memberships = await Member.findAll({
        where: {
            userId
        }
    }).catch(err => next(err));

    if (!memberships || !memberships.length) {
        const err = new Error('No memberships found');
        err.title = 'No memberships found';
        err.status = 404;
        err.errors = { memberships: 'No memberships found' };
        return next(err);
    }

    return res.json({ memberships });
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
router.put('/:id', restoreUser, requireAuth, membershipPermission, validateMember, async (req, res, next) => {
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
router.delete('/:id', restoreUser, requireAuth, membershipPermission, async(req, res, next) => {
    const { id } = req.params;

    const deleted = await Member.destroy({
        where: {
            id
        }
    }).catch(err => next(err));

    return res.json({ deleted: (deleted) ? 'succesfully deleted' : 'failed to delete' });
});


module.exports = router;
