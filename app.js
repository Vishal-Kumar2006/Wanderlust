// All Required
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
require("dotenv").config();

const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL = process.env.MONGO_URL;

// DB CONNECTION
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}
main();

// APP CONFIG
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// SESSION STORE
const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SESSION_SECRET || "mysupersecretstring",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Mongo Session Store Error:", err);
});

// SESSION CONFIG
const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET || "mysupersecretstring",
  resave: false,
  saveUninitialized: false, // ✅ FIXED
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // ✅ moved inside cookie
  },
};
app.use(session(sessionOptions));
app.use(flash());

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ROUTES
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 HANDLER
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// SERVER
app.listen(8080, () => {
  console.log("🚀 Server running at http://localhost:8080/");
});
