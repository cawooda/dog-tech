require('dotenv').config();
const termsAddress = process.env.TERMSADDRESS;
const siteTitle = process.env.SITE_TITLE;
//this stores the site title and terms and conditions page

const router = require('express').Router();
//get router
const { RegisteredUser, Post, Comment } = require('../model');
//get models for use in queries

const postRoute = require('./postRoutes');
//send post related requests to that router.

//

router.use('/posts', postRoute);

//router.use(logUser);

router.get('/', async (req, res) => {
	try {
		const postData = await Post.findAll({
			order: [['created_at', 'DESC']],
			include: { all: true, nested: true },
		}); //could filter for logged in user

		const posts = await postData.map((post) => post.get({ plain: true }));
		res.render('home', {
			posts: posts,
			siteTitle: siteTitle,
			user_id: req.session.user_id,
			testData: req.session.testing ? req.session.testData : false,
			loggedIn: req.session.loggedIn,
			loggedOut: !req.session.loggedIn,
			pageTitle: 'Home Page',
		});
	} catch (error) {}
});

router.get('/about', async (req, res) => {
	return res.render('about', {
		siteTitle: siteTitle,
		testData: req.session.testing ? req.session.testData : false,
		loggedIn: req.session.loggedIn,
		loggedOut: !req.session.loggedIn,
		pageTitle: 'About Page',
	});
});

router.get('/contact', async (req, res) => {
	return res.render('contact', {
		siteTitle: siteTitle,
		pageTitle: 'Contact Page',
	});
});

router.get('/signup', async (req, res) => {
	return res.render('register-user', {
		termsAddress: termsAddress,
		siteTitle: siteTitle,
		testData: req.session.testing ? req.session.testData : false,
		loggedIn: req.session.loggedIn,
		loggedOut: !req.session.loggedIn,
		pageTitle: 'Sign Up Page',
	});
});

router.get('/login', async (req, res) => {
	return res.render('login-user', {
		siteTitle: siteTitle,
		testData: req.session.testing ? req.session.testData : false,
		loggedIn: req.session.loggedIn,
		loggedOut: !req.session.loggedIn,
		pageTitle: 'Login Page',
	});
});

router.get('/logout', async (req, res) => {
	req.session.destroy();

	res.redirect('/');
});

router.get('/terms-and-conditions', async (req, res) => {
	return res.render('terms-and-conditions', {
		termsAddress: termsAddress,
		siteTitle: siteTitle,
		testData: req.session.testing ? req.session.testData : false,
		loggedIn: req.session.loggedIn,
		loggedOut: !req.session.loggedIn,
		pageTitle: 'Terms and Conditions',
	});
});

router.get('/', (req, res) => {
	res.status(200).send('controller OK');
});

module.exports = router;
