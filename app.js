const express = require("express"),
  mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

mongoose
  .connect("mongodb://localhost/yelpCamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to yelpCamp database!"))
  .catch((error) => console.log(error.message));

app.get("/",(req,res)=>{
    res.send("test Yelp Camp");
});

app.listen(3000, ()=>{
    console.log("Server on Port 3000");
})
