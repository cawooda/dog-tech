require('dotenv').config();
const router = require('express').Router();
const { Post, Comment } = require('../model');
//get required models.

const siteTitle = process.env.SITE_TITLE;
//get site title for passing to templates.

router.get('/', async (req, res) => {
	//gets all posts in order of creation
	try {
		const postData = await Post.findAll({
			order: [['created_at', 'DESC']],
			include: { all: true, nested: true },
			order: [['created_at', 'DESC']],
		});

		const posts = await postData.map((post) => post.get({ plain: true }));
		//serialise the posts

		res.render('home', {
			//render the page passng site title and the post information in posts. Some session info is also passed which
			//helps with some form submissions.
			posts: posts,
			siteTitle: siteTitle,
			user_id: req.session.user_id,
			testData: req.session.testing ? req.session.testData : false,
			loggedIn: req.session.loggedIn,
			loggedOut: !req.session.loggedIn,
			pageTitle: 'Posts Page',
		});
	} catch (error) {
		console.log(error);
	}
});

//This route displays template and  form for creating a new post. details about the user is passed over for the forms
router.get('/new', async (req, res) => {
	if (req.session.loggedIn) {
		res.render('new-post', {
			siteTitle: siteTitle,
			testData: req.session.testing ? req.session.testData : false,
			user_id: req.session.user_id,
			loggedIn: req.session.loggedIn,
			loggedOut: !req.session.loggedIn,
			pageTitle: 'New Post',
		});
	} else res.redirect('/login');
});

//this route handles the displaying of a comment form with an associated post id. I would have much prefered to render a
// simple add comment form at the end of each post but I couldnt quite get there.

router.get('/comments/:post_id', async (req, res) => {
	const id = req.params.post_id;
	try {
		const postData = await Post.findOne({
			where: {
				id: id,
			},
			include: Comment,
		});

		const post = await postData.get({ plain: true });
		//seroialise post data
		res.render('post', {
			post: post,
			post_id: id,
			user_id: req.session.user_id,
			siteTitle: siteTitle,
			testData: req.session.testing ? req.session.testData : false,
			loggedIn: req.session.loggedIn,
			loggedOut: !req.session.loggedIn,
			pageTitle: 'Posts Page',
		});
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
