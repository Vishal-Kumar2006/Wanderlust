const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


// Middleware to check if the user is Logged in!
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in First");
        return res.redirect("/login");
    }

    next();
}

// Middleare To redirect on the same Url from where the user try to Login/signup  
module.exports.savedRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// Middleware For checking that the currOwner is the Owner of that Listing
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the Owner of this Listing....!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

// Middleware For Validating the reviews 
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(404, errMsg);
    } else {
      next();
    }
  };

// Middleware For Validating the reviews 
module.exports.validateReview = (req, res, next) => {
      let { error } = reviewSchema.validate(req.body);
      if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
      } else {
        next();
      }
};

// Middleware For checking that the currAuthor is the Author of that Review
module.exports.isreviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    
    console.log(review); 
    console.log(review.author);
    if(!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the Author of this review.....!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}