const express = require("express");
const path = require("path"); //built in with node
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

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
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: true }));
//can use other word instead_method -> _method is parameter in query string
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", async (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req,res)=>{
  const campground = await Campground.findByIdAndUpdate(req.params.id,{
    title: req.body.campground.title,
    location: req.body.campground.location,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req,res)=>{
  await Campground.findByIdAndRemove(req.params.id);
  res.redirect("/campgrounds/");
})

app.listen(3000, () => {
  console.log("Server on Port 3000");
});
