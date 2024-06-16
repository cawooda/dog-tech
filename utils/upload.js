const multer = require('multer');
const path = require('path');

const fileStorage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'public/uploads');
	},
	filename: (req, file, cb) => {
		cb(
			null,
			`${file.fieldname}-${Date.now()}-${path.parse(file.originalname).name}${path.extname(file.originalname)}`,
		);
	},
});

// check file type
const checkFileType = (file, cb) => {
	// allowed extensions
	const filetypes = /jpeg|jpg|png|gif|/;

	// check extension
	const extname = filetypes.test(
		path.extname(file.originalname).toLowerCase(),
	);

	// check mime type
	const mimetype = filetypes.test(file.mimetype);

	if (extname && mimetype) {
		return cb(null, true);
	} else {
		cb('Error: Images only.');
	}
};

// init upload variable
const upload = multer({
	storage: fileStorage,
	limits: {
		// file limits here e.g fileSize
		fileSize: 50_000_000,
	},
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb);
	},
});

// init upload variable simple version
// const upload = multer({ dest: '../public/uploads' });

module.exports = upload;
