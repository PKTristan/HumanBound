const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const booksRouter = require('./books.js');
const circleRouter = require('./circles.js');
const approvalsRouter = require('./approvals.js');
const reviewsRouter = require('./reviews.js');
const repliesRouter = require('./replies.js');
const messagesRouter = require('./messages.js');
const membersRouter = require('./members.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/books', booksRouter);

router.use('/circles', circleRouter);

router.use('/approvals', approvalsRouter);

router.use('/reviews', reviewsRouter);

router.use('/replies', repliesRouter);

router.use('/messages', messagesRouter);

router.use('/members', membersRouter);


router.post('/test', function (req, res) {
    res.json({ requestBody: req.body });
});


module.exports = router;
