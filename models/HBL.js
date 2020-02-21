var mongoose = require("mongoose");

var HBLSchema = new mongoose.Schema({
    bankName: {
        type: String,
        default: "HBL"
    },
    acc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    }
});

module.exports = mongoose.model("HBL",HBLSchema);