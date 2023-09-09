const { Op } = require('sequelize');

const addId = (req, res, next) => {
    req.body.id = req.params.id;
    next();
}

function getLikeOperator() {
    const isPostgres = process.env.NODE_ENV === 'production';

    return isPostgres ? Op.iLike : Op.like;
}


module.exports = {
    addId,
    getLikeOperator
}
