const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");


// Get Request For Signup
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// Post Request For Signup
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;

      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err)=> {
        if(err) {
          return next(err)
        }
        req.flash("sucess", "Welcome to WanderLust!");
      })
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);


// Loggin Get Request
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// Loggin Post Request
router.post(
  "/login",
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
      req.flash("sucess", "welcome to wanderLust you are Logged in!!!");
      let redirectUrl = res.locals.redirectUrl || "/listings" 
      res.redirect(redirectUrl);
  }
);


// For Logout User
router.get("/logout", (req, res, next) => {
  req.logOut((error)=> {
    if(error) {
      return next(error);
    }

    req.flash("sucess", "You are Logged Out!");
    res.redirect("/listings");
  })

});

module.exports = router;
