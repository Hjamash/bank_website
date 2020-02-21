var mongoose = require("mongoose");

var MCBSchema = new mongoose.Schema({
    bankName: {
        type: String,
        default: "MCB"
    },
    acc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    }
});

module.exports = mongoose.model("MCB",MCBSchema);