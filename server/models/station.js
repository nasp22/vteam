// server/models/station.js
const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    name: String,
    scooter_quantity: Number,
    position: {
        lat: Number,
        lng: Number
    },
    city: String
});

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
