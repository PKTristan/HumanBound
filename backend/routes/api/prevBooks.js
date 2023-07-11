const express = require('express')
const router = express.Router();

const { restoreUser, requireAuth } = require('../../utils/auth');
const { addId } = require('../../utils/reference.js');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { PrevBook } = require('../../db/models');


//delete a previously read book from circle
router.delete('/:id', restoreUser, requireAuth, async (req, res, next) => {
    const { id } = req.params;

    const deleted = await PrevBook.destroy({
        where: { id }
    }).catch(err => next(err));

    return res.json({ deleted: (deleted) ? 'succesfully deleted' : 'failed to delete' });
});

module.exports = router;
