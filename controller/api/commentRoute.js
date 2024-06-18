const router = require('express').Router();
const upload = require('../../utils/upload');
const { Post, Comment, RegisteredUser } = require('../../model');

//function is called bout the route handler. Not sure if this is best, bit the function handles the creation of the
//sequelize call and the response. Probably I should let the route handle the response.
async function createComment(req, res, commentDetails) {
	console.log('create comment reached', commentDetails);
	try {
		const commentCreated = await Comment.create(commentDetails, {});
		if (commentCreated) {
			req.session.loggedIn = true;
			res.status(200).redirect('/posts');
		} else {
			res.status(500).json({
				message: `Creation failed for comment: ${commentDetails.title}. We think its something to do with the database`,
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: `Account Creation failed for comment: ${commentDetails.title}. We think it is not the database but the database error may also appear.`,
		});
	}
}

//This handles route which requests a new comment.
router.post('/new', async (req, res) => {
	if (!req.session.loggedIn) return;
	if (!req.session.user_id == req.body.user_id) return;

	const commentDetails = {
		user_id: req.session.user_id,
		post_id: req.body.post_id,
		content: req.body.content,
	};

	try {
		await createComment(req, res, commentDetails);
	} catch (error) {
		console.log(error);
		res.json({ message: 'an error occured', error: error });
	}
});

module.exports = router;
