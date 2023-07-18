const express = require('express')
const router = express.Router();

const { restoreUser, requireAuth } = require('../../utils/auth');
const { addId } = require('../../utils/reference.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op, Sequelize } = require('sequelize');


const { Review, User, Reply } = require('../../db/models');


//permission for eDITING AND DELETING a review
const valPermission = async(req, res, next) => {
    const { id } = req.params;
    const { id: userId, admin } = req.user;

    const reply = await Reply.findByPk(id).catch(err => next(err));

    if (!reply) {
        const err = new Error('No reply found');
        err.title = 'No reply found';
        err.status = 404;
        err.errors = { reply: 'No reply found' };
        return next(err);
    }

    if ((reply.userId !== userId) && !admin) {
        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.status = 403;
        err.errors = { review: 'Unauthorized' };
        return next(err);
    }

    return next();

}


//get all replies to a review
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    const replies = await Reply.findByPk(id, {
        include: [
            {
                model: User,
                attributes: ['id', 'username', 'avi']
            }
        ],
        where: {
            reviewId: id
        }
    }).catch(err => next(err));

    if (!replies || !replies.length) {
        const err = new Error('No replies found');
        err.title = 'No replies found';
        err.status = 404;
        err.errors = { replies: 'No replies found' };
        return next(err);
    }


    return res.json({ replies });
});


const validateReply = [
    check('reply')
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ min: 10, max: Infinity})
        .withMessage('Please provide a string that is larger than 10 characters.'),

        handleValidationErrors
]


//post a reply to a review
router.post('/', restoreUser, requireAuth, validateReply, async (req, res, next) => {
    const { reply, id: reviewId } = req.body;
    const { id: userId } = req.user;


    const newReply = await Reply.create({
        reviewId,
        userId,
        reply
    }).catch(err => next(err));


    if (!newReply) {
        const err = new Error('No reply found');
        err.title = 'No reply found';
        err.status = 404;
        err.errors = { reply: 'No reply found' };
        return next(err);
    }


    return res.json({ newReply });
});


//edit a reply to a review
router.put('/:id', restoreUser, requireAuth, valPermission, validateReply, async (req, res, next) => {
    const { id } = req.params;
    const { reply } = req.body;

    const [updated] = await Reply.update(
        {
            reply
        },
        {
            where: {
                id
            }
        }
    ).catch(err => next(err));


    if (!updated) {
        const err = new Error('No reply found');
        err.title = 'No reply found';
        err.status = 404;
        err.errors = { reply: 'No reply found' };
        return next(err);
    }


    return res.json({ updated: (updated) ? 'succesfully updated' : 'failed to update' });
});



//delete a reply to a review
router.delete('/:id', restoreUser, requireAuth, valPermission, async (req, res, next) => {
    const { id } = req.params;

    const deleted = await Reply.destroy({
        where: {
            id
        }
    }).catch(err => next(err));

    if (!deleted) {
        const err = new Error('No reply found');
        err.title = 'No reply found';
        err.status = 404;
        err.errors = { reply: 'No reply found' };
        return next(err);
    }


    return res.json({ deleted: (deleted) ? 'succesfully deleted' : 'failed to delete' });

});


module.exports = router;
