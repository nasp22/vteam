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
    city: String,
    scooter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scooter'
    },
    startfee: Number,
    start_time: Date,
    end_time: Date // null if rental is ongoing
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;
