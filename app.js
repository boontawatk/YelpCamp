const express = require("express");
const path = require("path"); //built in with node
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { nextTick } = require("process");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");

mongoose
  .connect("mongodb://localhost:27017/yelpCamp", {
    useNewUrlParser: true,
    useCreateIndex: true, //I have no idea why we need this
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to yelpCamp database!"))
  .catch((error) => console.log(error.message));

const app = express();
app.set("view engine", "ejs");
//set view directory in views folder(the second views)
//__dirname -> means= where this file is located
app.set("views", path.join(__dirname, "views"));
//use for custom css
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//can use other word instead_method -> _method is parameter in query string
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const validateCampground = (req,res,next)=>{
  // if (!req.body.campground)
    //   throw new ExpressError("Invalid Campground Data", 400);
    const campgroundSchema = Joi.object({
      campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
      }).required(),
    });
    //what's inside is what we want to pass data for validation
    //we want to pass req.body -> so we want to validate campground too
    //if we want just validate what's inside it we can pass req.body.campground and what's inside for schema
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    }
    else{next();}
}

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", async (req, res, next) => {
  res.render("campgrounds/new");
});

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground
    );
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndRemove(req.params.id);
    res.redirect("/campgrounds/");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});
//after catch will run this
//we can use express error extended to get status code
app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500;
  if (!err.message) err.message = "Something went wrong!";
  res.status(err.statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Server on Port 3000");
});
