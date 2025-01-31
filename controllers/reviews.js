const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



// Review -> Create Review 
module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("sucess", "New Review Added!!");
  res.redirect(`/listings/${listing.id}`);
};

// Review -> Delte Review
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    Listing.findByIdAndUpdate(id, { pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess", "Review Deleted!!");
    res.redirect(`/listings/${id}`);
  }
