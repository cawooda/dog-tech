const router = require("express").Router();
const { Post } = require("../model");

const siteTitle = "Site Title";

router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({});

    const posts = await postData.map((post) => post.get({ plain: true }));

    res.render("home", {
      posts: posts,
      siteTitle: siteTitle,
      testData: req.session.testing ? req.session.testData : false,
      loggedIn: req.session.loggedIn,
      loggedOut: !req.session.loggedIn,
      pageTitle: "Posts Page",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/new", async (req, res) => {
  if (req.session.loggedIn) {
    res.render("new-post", {
      siteTitle: siteTitle,
      testData: req.session.testing ? req.session.testData : false,
      user_id: req.session.user_id,
      loggedIn: req.session.loggedIn,
      loggedOut: !req.session.loggedIn,
      pageTitle: "New Post",
    });
  } else res.redirect("/login");
});

module.exports = router;
