var mongoose = require("mongoose");

var UBLSchema = new mongoose.Schema({
    bankName: {
        type: String,
        default: "UBL"
    },
    acc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    }
});

module.exports = mongoose.model("UBL",UBLSchema);