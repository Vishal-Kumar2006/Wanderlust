const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

const {
  GetSignUpForm,
  PostSignUpForm,
  GetLogInForm,
  PostLoginForm,
  LogOutController,
} = require("../controller/user.js");

// Get and Post Request for SignUp Route
router.route("/signup").get(GetSignUpForm).post(wrapAsync(PostSignUpForm));

// Get and Post Request for Login Route
router
  .route("/login")
  .get(GetLogInForm)
  .post(
    savedRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    PostLoginForm,
  );

// For Logout User
router.get("/logout", LogOutController);

module.exports = router;
