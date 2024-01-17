// server/models/log.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    start_position: {
        lat: Number,
        lng: Number
    },
    end_position: {
        lat: Number,
        lng: Number
    },
    from_time: Date,
    to_time: Date
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
