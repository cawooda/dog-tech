const router = require('express').Router();
const { RegisteredUser } = require('../../model');
const { validatePassword } = require('../../utils/helpers');

// this function is called to create a user if the form has passed details that the form required is registration as apposed to loggin in.
async function createUser(req, res, userDetails) {
	//console.log('create user called', userDetails);
	try {
		const userExists = await RegisteredUser.findAll({
			where: {
				email: userDetails.email,
			},
		});
		const userCreated = await RegisteredUser.create(userDetails, {});

		if (
			userExists.get({ plain: true }) ||
			userCreated.get({ plain: true }).id
		) {
			req.session.user_id = userCreated.id;
			req.session.loggedIn = true;
			res.status(201)
				.json({
					message: `Account Created for User: ${userDetails.first_name}`,
				})
				.redirect('/login');
		} else {
			res.status(500).json({
				message: `Account Creation failed for User: ${userDetails.first_name}. We think its something to do with the database`,
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: `Account Creation failed for User: ${userDetails.first_name}. We think it is not the database but the database error may also appear.`,
		});
	}
}

async function loginUser(req, res, loginDetails) {
	// console.log('login details', loginDetails);
	// console.log('req.session.loggedIn', req.session.loggedIn);
	try {
		//finds the user based on password submitted in body
		const userData = await RegisteredUser.findOne({
			where: {
				email: loginDetails.email,
			},
		});
		//console.log('login userdata', userData);
		//couldnt find user? send back a message letting client know.
		if (!userData) {
			res.status(400).json({
				message:
					'Coulndt find a user through that email, please try again',
			});
			return;
		}
		//the password is valid if the checkPassword method whick lives with the registered user model returns true. It is checking bcrypt.
		const validPassword = await userData.checkPassword(req.body.password);
		//console.log('valid password', validPassword);
		if (!validPassword) {
			console.log('not a valiud password');
			res.status(400).json({
				message: 'Incorect password, please try again',
			});
			return;
		}

		req.session.user_id = userData.id;
		req.session.loggedIn = true;
		//console.log('req.session.loggedIn', req.session.loggedIn);
		res.json({ message: 'logged in..' });
		//console.log('login function in user route end');
	} catch (error) {
		console.log('an error occurred', error);

		return;
	}
}

//Post requests to the root of users/ creates a new user with {firstname,lastname,email and password}
router.post('/', async (req, res) => {
	//check if password meets validation. since this is handling both login and registration, there may be some
	//problems down the track if the validation is updated and old users log in.
	//console.log('req.body', req.body);
	if (!validatePassword(req.body.password)) {
		res.status(500)
			.json({ message: 'password does not meet requirements' })
			.redirect('/login');
		console.log('password validation failed');
		return;
	}

	const userDetails = {
		registration: req.body.registration ? true : false,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
	};
	//console.log('userdetails', userDetails);
	userDetails.registration
		? createUser(req, res, userDetails)
		: loginUser(req, res, userDetails);
});

router.post('/logout', async (req, res) => {
	if (req.session.logged_in) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});

module.exports = router;
