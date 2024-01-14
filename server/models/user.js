// server/models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    auth_id: String,
    first_name: String,
    last_name: String,
    status: String,
    role: String,
    credit_amount: Number,
    next_payment_date: Date,
    phone_number: String,
    email: String,
    log: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Log"
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
