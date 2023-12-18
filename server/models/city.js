// server/models/city.js
const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: String,
    position: {
        lat: Number,
        lng: Number
    },
});

const City = mongoose.model('City', citySchema);

module.exports = City;
