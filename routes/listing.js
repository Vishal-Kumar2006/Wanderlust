const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");



// Validate Listing Middleware
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};



// Index Route
router.get(
    "/",
    wrapAsync(async (req, res) => {
      const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });
    })
  );
  
  // New Route
  router.get(
    "/new",
    wrapAsync((req, res) => {
      res.render("listings/new.ejs");
    })
  );
  
  // Show Route
  router.get(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id).populate("reviews");
      res.render("listings/show.ejs", { listing });
    })
  );
  
  // Create Route
  router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {
      let result = listingSchema.validate(req.body);
      console.log(result);
      if (result.error) {
        throw new ExpressError(404, result.error);
      }
      const newListing = new Listing(req.body.listing);
      if (newListing.save()) {
        console.log("New Listing is Added");
      } else
        (err) => {
          console.log(err);
        };
      res.redirect("/listings");
    })
  );
  
  // Edit Route
  router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      res.render("listings/edit.ejs", { listing });
    })
  );
  
  // Update Route
  router.put(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      res.redirect(`/listings/${id}`);
    })
  );
  
  // Delete Route
  router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      res.redirect("/listings");
    })
  );
  
  


  module.exports = router;
  