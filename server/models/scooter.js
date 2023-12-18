// server/models/scooter.js
const mongoose = require('mongoose');

const scooterSchema = new mongoose.Schema({
    status: Number,
    model: String,
    station: {
        name: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Station'
        },
        city: String
    },
    position: {
        lat: Number,
        lng: Number
    },
    log: Array
});

const Scooter = mongoose.model('Scooter', scooterSchema);

module.exports = Scooter;
