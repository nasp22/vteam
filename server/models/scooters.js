const mongoose = require('mongoose');

const scooterSchema = new mongoose.Schema({
    status: Number,
    model: String,
    station: Number,
    log: Array
});

const Scooter = mongoose.model('Scooter', scooterSchema);

module.exports = Scooter;
