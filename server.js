require('dotenv').config();

const PORT = process.env.PORT || 3001;
//helpers and utils
const helpers = require('./utils/helpers');
const path = require('path');

//express
const express = require('express');
const app = express();

//sequelize
const { sequelize } = require('./config/connection');

//sessions
//create express session
const session = require('express-session');
//create sequelize store for connecting express session to storage.
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },

	store: new SequelizeStore({
		db: sequelize,
	}),
};
app.use(session(sess));

//encoding
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
const router = require('./controller');

//view engine
const expressHandlebarsEngine = require('express-handlebars');
const handlebars = expressHandlebarsEngine.create({ helpers });

//aplies a "setting" defining the view engine as handlebars
app.engine('handlebars', handlebars.engine);
//This sets the view engine whhich the app will use when it calls render()
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

//TESTING
function testing(req, _res, next) {
	console.log('testing');
	console.log(process.env.TESTING);
	if (process.env.TESTING == 'true') {
		req.session.testing = true;
		req.session.testData = {
			first_name: 'Andrew',
			last_name: 'Cawood',
			email: 'cawooda@gmail.com',
			password: 'Secret!123',
		};
	} else {
		req.session.testing = false;
	}
	next();
}

app.use(testing);

app.use(router);

sequelize.sync({ force: false }).then(() => {
	app.listen(PORT, () => {
		console.log(
			`Example app listening on port ${PORT}. http://localhost:${PORT}`
		);
	});
});

console.log('DB_URL:', process.env.DB_URL);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
