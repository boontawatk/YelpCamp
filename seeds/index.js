const mongoose = require("mongoose");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");
const Campground = require("./../models/campground");

mongoose
  .connect("mongodb://localhost:27017/yelpCamp", {
    useNewUrlParser: true,
    useCreateIndex: true,//I have no idea why we need this
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to yelpCamp database!"))
  .catch((error) => console.log(error.message));

const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDB = async()=>{
    //delete everything from dbs first
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        let random1000=Math.floor(Math.random()*1000);
        const camp=new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        });
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})