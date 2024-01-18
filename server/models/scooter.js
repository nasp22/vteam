// server/models/scooter.js
const mongoose = require('mongoose');

const scooterSchema = new mongoose.Schema({
    status: Number,
    model: String,
    city: String,
    station: {
        name: String,
        id: String,
        city: String
    },
    position: {
        lat: Number,
        lng: Number
    },
    battery: Number,
    speed_in_kmh: Number,
    log: Array
});

const Scooter = mongoose.model('Scooter', scooterSchema);

module.exports = Scooter;
