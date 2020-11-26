const express = require("express");
const path = require("path"); //built in with node
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user");
//router
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users");

//custom function
const ExpressError = require("./utils/ExpressError");

mongoose
  .connect("mongodb://localhost:27017/yelpCamp", {
    useNewUrlParser: true,
    useCreateIndex: true, //I have no idea why we need this
    useUnifiedTopology: true,
    useFindAndModify:false
  })
  .then(() => console.log("Connected to yelpCamp database!"))
  .catch((error) => console.log(error.message));

const app = express();
app.set("view engine", "ejs");
//set view directory in views folder(the second views)
//__dirname -> means= where this file is located
app.set("views", path.join(__dirname, "views"));
//use for custom css
app.use(express.static(path.join(__dirname + "/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//can use other word instead_method -> _method is parameter in query string
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const sessionConfig={
  secret: 'juststringforthesecret',
  resave: false,
  //config more for cookie
  saveUninitialized: true,
  cookie:{
    //more security
    httpOnly: true,
    expires: Date.now() + 1000*60*60*24*7, // 7 days
    maxAge:1000*60*60*24*7
  }
}

app.use(session(sessionConfig));
app.use(flash());

//passport
app.use(passport.initialize());
//passport.session need to be used after session(app.use(session())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  //left is variable that we pass, right is key to our message
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/reviews",reviewsRoutes);
app.use("/",usersRoutes);

app.get("/", (req, res) => {

  res.render("home");
});

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
