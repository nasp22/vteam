// server/models/station.js
const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    name: String,
    scooters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scooter'
    }],
    position: {
        lat: Number,
        lng: Number
    },
    city: {
        name: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'City'
        }
    },
});

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
