const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js");

// Reviews(Post) Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("sucess", "New Review Added!!");
    res.redirect(`/listings/${listing.id}`);
  })
);

// Reviews (Delete Route)
router.delete(
  "/:reviewId",
  isLoggedIn,
  isreviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    Listing.findByIdAndUpdate(id, { pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess", "Review Deleted!!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
