var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
    name: String,
    image: String,
    ticketPrice: {
        type: Number,
        default: 700
    },
    quantity: Number,
    genre: String,
    scheduel: [{
        date: String,
        time: String,
        seatsAvaliable: Number
    }],
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    }]
});

module.exports = mongoose.model("Movie",movieSchema);