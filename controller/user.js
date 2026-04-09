const User = require("../models/user.js");

// Get Request For Signup
module.exports.GetSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

// Post Request For Signup
module.exports.PostSignUpForm = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    // req.login(registeredUser, (err)=> {
    //   if(err) {
    //     return next(err)
    //   }
    //   req.flash("sucess", "Welcome to WanderLust!");
    // })
    req.flash("sucess", "Welcome to WanderLust");
    res.redirect("/listings");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// Loggin Get Request
module.exports.GetLogInForm = (req, res) => {
  res.render("users/login.ejs");
};

// Loggin Post Request
module.exports.PostLoginForm = async (req, res) => {
  req.flash("sucess", "welcome to wanderLust you are Logged in!!!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// For Logout User
module.exports.LogOutController = (req, res, next) => {
  req.logOut((error) => {
    if (error) {
      return next(error);
    }

    req.flash("sucess", "You are Logged Out!");
    res.redirect("/listings");
  });
};
