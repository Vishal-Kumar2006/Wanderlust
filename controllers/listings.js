const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

// Listings -> Index Route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Listing -> New Route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Listing -> Show Route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("sucess", "Listing you requested, Dosen't Exist!!");
    res.redirect("/listings");
  }

  // console.log(listing)
  res.render("listings/show.ejs", { listing });
};

// Listing -> Create Route
module.exports.createListing = async (req, res) => {
 
  let url = " https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
  let filename = "image.name.png";
  if(req.file) {
    url = req.file.path;
    filename = req.file.filename;
  }
  

  let result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(404, result.error);
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("sucess", "New Listing Created");
  res.redirect("/listings");
};

// Listing ->  Edit Route
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested, Dosen't Exist!!");
    res.redirect("/listings");
  }

  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/w_250")
  res.render("listings/edit.ejs", { listing, originalImage});
};

// Listing -> Update Route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("sucess", "Listing Updated Sucessfully!!");
  res.redirect(`/listings/${id}`);
};

// Listing -> Delete Route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("sucess", "Listing Deleted!!");
  res.redirect("/listings");
};
