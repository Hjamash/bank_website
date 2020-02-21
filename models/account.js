var mongoose = require("mongoose");

var accountSchema = new mongoose.Schema({
    accNo: Number,
    cardNo: Number,
    amount: Number,
    status: Boolean,
    // type: String,
    limit: Number,
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer", 
    }
});

module.exports = mongoose.model("Account",accountSchema);