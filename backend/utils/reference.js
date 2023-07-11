const addId = (req, res, next) => {
    req.body.id = req.params.id;
    next();
}


module.exports = {
    addId
}
