const express = require("express"),
  mongoose = require("mongoose"),
  path = require("path");
const app = express();

app.set("view engine", "ejs");

//set view directory in views folder(the second views)
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect("mongodb://localhost/yelpCamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to yelpCamp database!"))
  .catch((error) => console.log(error.message));

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("Server on Port 3000");
});
