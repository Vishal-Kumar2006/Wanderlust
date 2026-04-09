const Listing = require("../models/listing.js");

// Get: Index Route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Get: New Route
module.exports.renderNewListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showByCategory = async (req, res) => {
  const { category } = req.params;
  const allListings = await Listing.find({ category: category });
  res.render("listings/index.ejs", { allListings });
};

// Get: Show Route
module.exports.showListingById = async (req, res) => {
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
    req.flash("false", "Listing you requested, Dosen't Exist!!");
    res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// Post: Create Route
module.exports.createNewListing = async (req, res, next) => {
  console.log(req.body);

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  const savedListing = await newListing.save();

  console.log(savedListing);
  req.flash("success", "New Listing Created");

  return res.redirect("/listings");
};

// Get: Edit Route (Form Render)
module.exports.editListingForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested, Dosen't Exist!!");
    res.redirect("/listings");
  }

  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/h_200,w_300");
  res.render("listings/edit.ejs", { listing, originalImage });
};

// Put: Update Route
module.exports.updateListingById = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("sucess", "Listing Updated Sucessfully!!");
  res.redirect(`/listings/${id}`);
};

// Delete: Delete Route
module.exports.destroyListingById = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("sucess", "Listing Deleted!!");
  res.redirect("/listings");
};
