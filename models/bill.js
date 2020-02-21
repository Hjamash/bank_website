var mongoose = require("mongoose");

var billSchema = new mongoose.Schema({
    title: String,
    dueDate: String,
    paid: {
        type: Boolean,
        default: false
    },
    amount: Number,
    transaction:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    }
});

module.exports = mongoose.model("Bill",billSchema);