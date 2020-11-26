const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(passportLocalMongoose);//add username & password to schema

module.exports = mongoose.model("User", UserSchema);