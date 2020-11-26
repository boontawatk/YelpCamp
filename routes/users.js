const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", catchAsync(async (req, res) => {
  try{
      const { email, username, password } = req.body.user;
  const user = new User({ email: email, username: username });
  const registeredUser = await User.register(user, password); // create email username salted password, hashed password for us
  req.flash("success","Welcome to Yelp Camp");
  res.redirect("/campgrounds");//.register will already save to mongoose for us
  }
  catch(error){
      req.flash("error", error.message);
      res.redirect('/register');
  }
}));

module.exports = router;
