const router = require('express').Router();
const { Post, Comment } = require('../model');

const siteTitle = 'Site Title';

router.get('/', async (req, res) => {
	console.log('req.session.loggedIn', req.session.loggedIn);
	try {
		const postData = await Post.findAll({
			order: [['created_at', 'DESC']],
			include: { all: true, nested: true },
		});

		const posts = await postData.map((post) => post.get({ plain: true }));
		console.log(posts);
		res.render('home', {
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

router.get('/comments/:post_id', async (req, res) => {
	console.log(req.params.post_id);
	const id = req.params.post_id;
	try {
		const postData = await Post.findOne({
			where: {
				id: id,
			},
			include: Comment,
		});

		const post = await postData.get({ plain: true });
		console.log('user id', req.session.user_id);
		console.log('post id', id);
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
