var mongoose = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");

var customerSchema = new mongoose.Schema({
    Fname: String,
    Lname: String,
    age: Number,
    address: String,
    cellNo: Number,
    blocked: Boolean,
    acc: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account"
        },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Transaction"
    }],
    bills:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill"
    }],
    tickets:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    }]
});

// customerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Customer",customerSchema); 