const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");




// Validate Review Middleware
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(404, errMsg);
    } else {
      next();
    }
  };


// Reviews(Post) Route
router.post(
    "/",
    validateReview,
    wrapAsync(async (req, res) => {
      let listing = await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review);
  
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      res.redirect(`/listings/${listing.id}`);
    })
  );
  
  
  // Reviews (Delete Route)
  router.delete("/:reviewId", wrapAsync(async (req, res)=> {
    let {id, reviewId} = req.params;
    Listing.findByIdAndUpdate(id, {pull : {reviews : reviewId }});
    let result = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }));
  

  module.exports = router;