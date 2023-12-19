// server/models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    status: String,
    role: String,
    credit_amount: Number,
    phone_number: String,
    email: String,
    log: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Log"
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
