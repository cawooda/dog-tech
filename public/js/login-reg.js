const $authForm = document.getElementById('auth-form');
//this script handles both user registration and user lgoin depending on which handlebars template is being viewed.
//The form data below is the same for both but registration has extra name and lastname.

const $firstNameInput = document.getElementById('first-name-input');
const $lastNameInput = document.getElementById('last-name-input');
const $emailInput = document.getElementById('email-input');
const $passwordInput = document.getElementById('password-input');
const $agreesToTermsInput = document.getElementById('agrees-terms');

const FETCHURL = '/api/users';

function passwordValid(pwd) {
	if (pwd.length > 7) return true;
}

async function submitUserLogin() {
	console.log('login called');
	if (passwordValid($passwordInput.value)) {
		loginDetails = {
			registration: false,
			email: $emailInput.value,
			password: $passwordInput.value,
		};
		console.log(loginDetails.password);
		try {
			const response = await fetch(FETCHURL, {
				method: 'POST',
				mode: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(loginDetails),
			});

			const result = await response.json();
			response.ok
				? console.log('Login successful:', result)
				: console.log('Login unSuccessful:', result);
			window.location.href = '/';
		} catch (error) {
			console.log(JSON.stringify(error));
		}
	}
}

async function submitUserRegistration() {
	console.log('registration called');
	if (passwordValid($passwordInput.value) && $agreesToTermsInput.value) {
		loginDetails = {
			registration: true,
			first_name: $firstNameInput.value,
			last_name: $lastNameInput.value,
			email: $emailInput.value,
			password: $passwordInput.value,
			terms_agreed: $agreesToTermsInput.value == 'on' ? true : false,
		};
		try {
			const response = await fetch(FETCHURL, {
				method: 'POST',
				mode: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(loginDetails),
			});
			if (response.ok) console.log('successfully created user');
			window.location.href = '../';
		} catch (error) {
			console.error(error);
		}
	}
}

$authForm.addEventListener('submit', (event) => {
	event.preventDefault();
	console.log(
		'if true, this is from a registration form',
		event.target.dataset.registration,
	);
	console.log(
		'if false, this is login form',
		event.target.dataset.registration,
	);

	if (event.target.dataset.registration == 'true') {
		submitUserRegistration();
	} else {
		submitUserLogin();
	}
});
