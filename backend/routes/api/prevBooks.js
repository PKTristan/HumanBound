const express = require('express')
const router = express.Router();

const { restoreUser, requireAuth } = require('../../utils/auth');
const { addId } = require('../../utils/reference.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { PrevBook, Member } = require('../../db/models');


const prevPermission = async (req, res, next) => {
    const { id } = req.params;
    const { id: userId, admin } = req.user;

    const prev = await PrevBook.findByPk(id).catch(err => next(err));

    if (!prev) {
        const err = new Error('No prev book found');
        err.title = 'No prev book found';
        err.status = 404;
        err.errors = { prev: 'No prev book found' };
        return next(err);
    }

    const [membership] = await Member.findAll({ where: { userId, circleId: prev.circleId }}).catch(err => next(err));


    if (!admin && (!membership || membership.status !== 'host')) {
        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.status = 403;
        err.errors = { prev: 'Unauthorized' };
        return next(err);
    }

    return next();
}


//delete a previously read book from circle
router.delete('/:id', restoreUser, requireAuth, prevPermission, async (req, res, next) => {
    const { id } = req.params;

    const deleted = await PrevBook.destroy({
        where: { id }
    }).catch(err => next(err));

    return res.json({ deleted: (deleted) ? 'succesfully deleted' : 'failed to delete' });
});

module.exports = router;
