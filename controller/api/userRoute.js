const router = require("express").Router();
const { RegisteredUser } = require("../../model");
const { validatePassword } = require("../../utils/helpers");

async function createUser(req, res, userDetails) {
  try {
    const userCreated = await RegisteredUser.create(userDetails, {});
    if (userCreated) {
      req.session.loggedIn = true;
      res.status(201).json({
        message: `Account Created for User: ${userDetails.first_name}`,
      });
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
  console.log("login function in user route run");
  console.log("login details", loginDetails);
  console.log("req.session.loggedIn", req.session.loggedIn);
  try {
    //finds the user based on password submitted in body
    const userData = await RegisteredUser.findOne({
      where: {
        email: loginDetails.email,
      },
    });
    //couldnt find user? send back a message letting client know.
    if (!userData) {
      res.status(400).json({
        message: "Coulndt find a user through that email, please try again",
      });
      return;
    }
    //the password is valid if the checkPassword method whick lives with the registered user model returns true. It is checking bcrypt.
    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      console.log("not a valiud password");
      res.status(400).json({ message: "Incorect password, please try again" });
      return;
    }

    req.session.user_id = userData.id;
    req.session.loggedIn = true;
    res.json({ message: "logged in.." });
    console.log("login function in user route end");
    console.log("req.session.loggedIn", req.session.loggedIn);
  } catch (error) {
    console.log("an error occurred", error);

    return;
  }
}

//Post requests to the root of users/ creates a new user with {firstname,lastname,email and password}
router.post("/", async (req, res) => {
  //check if password meets validation. since this is handling both login and registration, there may be some
  //problems down the track if the validation is updated and old users log in.

  if (!validatePassword(req.body.password)) {
    res
      .status(500)
      .json({ message: "password does not meet requirements" })
      .end();
    console.log("password validation failed");
    return;
  }

  const userDetails = {
    registration: req.body.registration ? true : false,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  };

  userDetails.registration
    ? createUser(req, res, userDetails)
    : loginUser(req, res, userDetails);
});

router.post("/logout", async (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
