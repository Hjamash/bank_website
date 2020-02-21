var mongoose = require("mongoose");

var scheduelSchema = new mongoose.Schema({
    time: String,
    date: String,
    seatsAvaliable: Number
});

module.exports = mongoose.model("Scheduel",scheduelSchema);