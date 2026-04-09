const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {
  index,
  renderNewListingForm,
  showListingById,
  createNewListing,
  editListingForm,
  updateListingById,
  destroyListingById,
  showByCategory,
} = require("../controller/listingss.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// For Index: (Get all Listings) a  &  Create Listing after Form
router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(createNewListing),
  );

// New Route
router.get("/new", isLoggedIn, wrapAsync(renderNewListingForm));

router.get("/category/:category", wrapAsync(showByCategory));

// To {(Show) (Edit) & (Delete)}Listing by Id
router
  .route("/:id")
  .get(wrapAsync(showListingById))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(updateListingById),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(destroyListingById));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListingForm));

module.exports = router;
