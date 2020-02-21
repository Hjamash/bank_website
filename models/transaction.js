var mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema({
    date: String,
    payer: String,
    beneficiary: String,
    amount: Number
});

module.exports = mongoose.model("Transaction",transactionSchema);