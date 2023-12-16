// server/models/log.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    from_station: Number,
    to_station: Number,
    from_time: Date,
    to_time: Date
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
