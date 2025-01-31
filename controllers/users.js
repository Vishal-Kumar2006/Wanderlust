const User = require("../models/user.js");

// Get Request For Render Signup Form
module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

// Post Request to Sign Up and Login User
module.exports.signUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("sucess", "Welcome to WanderLust!");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// Get Request For Render Log In Form in DB
module.exports.renderLogInForm = (req, res) => {
  res.render("users/login.ejs");
};

// Loggin Post Request to Login User after Checking in DB
module.exports.logIn = async (req, res) => {
  req.flash("sucess", "welcome to wanderLust you are Logged in!!!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// For Logout User
module.exports.logOut = (req, res, next) => {
  req.logOut((error) => {
    if (error) return next(error);

    req.flash("sucess", "You are Logged Out!");
    res.redirect("/listings");
  });
};
