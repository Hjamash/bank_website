var mongoose = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");

var adminSchema = new mongoose.Schema({
    Fname: String,
    Lname: String,
    age: Number,
    address: String,
    cellNo: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

// adminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Admin",adminSchema); 