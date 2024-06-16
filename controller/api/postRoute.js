const router = require('express').Router();
const upload = require('../../utils/upload');
const { Post, RegisteredUser } = require('../../model');

async function createPost(req, res, postDetails) {
	try {
		const postCreated = await Post.create(postDetails, {});
		if (postCreated) {
			req.session.loggedIn = true;
			res.status(200).json({
				message: ` Created for post: ${postDetails.title}`,
			});
		} else {
			res.status(500).json({
				message: `Creation failed for post: ${postDetails.title}. We think its something to do with the database`,
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: `Account Creation failed for post: ${postDetails.title}. We think it is not the database but the database error may also appear.`,
		});
	}
}

router.post('/new', upload.single('file'), async (req, res) => {
	console.log('req to new post');

	if (!req.session.loggedIn) return;
	if (!req.session.user_id == req.body.user_id) return;

	const postDetails = {
		user_id: req.session.user_id,
		title: req.body.title,
		content: req.body.content,
		img: req.file.path.replace('public/', ''),
	};

	try {
		await createPost(req, res, postDetails);
	} catch (error) {
		console.log(error);
		res.json({ message: 'an error occured', error: error });
	}
});

module.exports = router;
