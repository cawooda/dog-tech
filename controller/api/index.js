const router = require('express').Router();
const registeredUserRoute = require('./userRoute');
const postsRoute = require('./postRoute');
const commentsRoute = require('./commentRoute');

router.use('/users', registeredUserRoute);
router.use('/posts', postsRoute);
router.use('/comments', commentsRoute);

router.get('/', (req, res) => {
	console.log('api reached');
	req.send('api reached');
});

module.exports = router;
