// server/models/status.js
const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    status_code: Number,
    status_name: String,
    description: String
});

const Status = mongoose.model('Status', statusSchema);

module.exports = Status;