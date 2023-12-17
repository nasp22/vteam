// server/models/rental.js
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    user: {
        first_name: String,
        last_name: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    scooter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scooter'
    },
    startfee: Number,
    destination_station: {
        name: String,
        city: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Station'
        }
    },
    start_time: Date,
    end_time: Date
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;
