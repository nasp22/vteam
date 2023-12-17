// server/models/log.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    from_station: {
        name: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Station'
        },
        city: String
    },
    to_station: {
        name: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Station'
        },
        city: String
    },
    from_time: Date,
    to_time: Date
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
