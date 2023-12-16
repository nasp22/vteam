// server/models/scooter.js
const mongoose = require('mongoose');

const scooterSchema = new mongoose.Schema({
    status: Number,
    model: String,
    station: Number,
    position: {
        lat: Number,
        lng: Number
    },
    log: Array
});

const Scooter = mongoose.model('Scooter', scooterSchema);

module.exports = Scooter;
