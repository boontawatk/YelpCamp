const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", catchAsync(async (req, res) => {
  try{
      const { email, username, password } = req.body.user;
  const user = new User({ email: email, username: username });
  const registeredUser = await User.register(user, password); // create email username salted password, hashed password for us
  req.login(registeredUser,err=>{
    if(err){ next(err)}
    req.flash("success","Welcome to Yelp Camp");
    res.redirect("/campgrounds");//.register will already save to mongoose for us
  })
  }
  catch(error){
      req.flash("error", error.message);
      res.redirect('/register');
  }
}));

router.get('/login',(req,res)=>{
    res.render('users/login');
});

router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}),(req,res)=>{
    req.flash("success","Welcome back!");
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye");
  res.redirect("/campgrounds");
});

module.exports = router;