const express = require("express");

const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const validateSchema = require("../models/validateSchema");


const router = express.Router();

const validateCampground = (req,res,next)=>{
    //what's inside is what we want to pass data for validation
    //we want to pass req.body -> so we want to validate campground too
    //if we want just validate what's inside it we can pass req.body.campground and what's inside for schema
    const { error } = validateSchema.Campground.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    }
    else{next();}
}

const validateReview = (req,res,next)=>{
    //what's inside is what we want to pass data for validation
    //we want to pass req.body -> so we want to validate campground too
    //if we want just validate what's inside it we can pass req.body.campground and what's inside for schema
    const { error } = validateSchema.Review.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    }
    else{next();}
  }

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", async (req, res, next) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );

    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground
    );
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndRemove(req.params.id);
    res.redirect("/campgrounds/");
  })
);

router.delete(
  "/:id/reviews/:reviewId",
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
  "/:id/reviews",
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