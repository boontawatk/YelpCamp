const express = require("express");

const Review = require("../models/review");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const validateSchema = require("../models/validateSchema");

const validateReview = (req, res, next) => {
  //what's inside is what we want to pass data for validation
  //we want to pass req.body -> so we want to validate campground too
  //if we want just validate what's inside it we can pass req.body.campground and what's inside for schema
  const { error } = validateSchema.Review.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const router = express.Router({mergeParams:true});

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    //we need to remove reviewId from relation in campground and update
    //mongoose has this method to do something like this (delete array in mongoose)
    //this line is new ***
    await Campground.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId },
    });
    await Review.findByIdAndRemove(req.params.reviewId);
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review); //Objectid was create already when new model
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

module.exports = router;
