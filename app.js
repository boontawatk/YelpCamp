const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground")

mongoose
  .connect("mongodb://localhost:27017/yelpCamp", {
    useNewUrlParser: true,
    useCreateIndex: true,//I have no idea why we need this
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to yelpCamp database!"))
  .catch((error) => console.log(error.message));

const app = express();
app.set("view engine", "ejs");
//set view directory in views folder(the second views)
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("Server on Port 3000");
});
