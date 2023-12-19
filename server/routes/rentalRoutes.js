// server/routes/rentalRoutes.js

const express = require('express');
const router = express.Router();
const { apiResponse } = require('../utils.js');
const Rental = require('../models/rental.js');
const User = require('../models/user.js');
const Station = require('../models/station.js');

// Get all rentals
router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find();
        const response = apiResponse(true, rentals, 'Rentals retrieved successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error retrieving rentals', 500);
        res.status(response.statusCode).json(response);
    }
});

// Delete all rentals
router.delete('/', async (req, res) => {
    try {
        const result = await Rental.deleteMany();

        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'Rentals deleted successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error deleting rentals', 500);
        res.status(response.statusCode).json(response);
    }
});

// Create a rental
router.post('/:scooter_id/:user_id', async (req, res) => {
    const scooter_id = req.params.scooter_id;
    const user_id = req.params.user_id;
    const user = await User.findById(user_id);

    if (!user) {
        const response = apiResponse(false, null, 'User not found', 404);
        res.status(response.statusCode).json(response);
        return;
    }
    let station;
    if (req.body.destination_station && req.body.destination_station.id) {
        station = await Station.findById(req.body.destination_station.id);
    } else if (req.body.destination_station && req.body.destination_station.name && req.body.destination_station.city) {
        station = await Station.findOne({ name: req.body.destination_station.name, 'city.name': req.body.destination_station.city });
    }

    if (!station) {
        const response = apiResponse(false, null, 'Station not found', 404);
        res.status(response.statusCode).json(response);
        return;
    }

    try {
        const newRental = new Rental({
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                id: user._id
            },
            scooter_id: scooter_id,
            startfee: req.body.startfee,
            destination_station: {
                name: station.name,
                city: station.city.name,
                id: station._id
            },
            start_time: Date.now(),
            end_time: null
        });

        if (!newRental.user.id || !newRental.scooter_id || !newRental.startfee || !newRental.destination_station.id) {
            const response = apiResponse(false, null, 'Missing required fields', 400);
            res.status(response.statusCode).json(response);
            return;
        }

        const rental = await newRental.save();

        const response = apiResponse(true, rental, 'Rental created successfully', 201);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error creating rental', 500);
        res.status(response.statusCode).json(response);
    }
});

// Get rental by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const rental = await Rental.findById(id);

        if (!rental) {
            const response = apiResponse(false, null, 'Rental not found', 404);
            res.status(response.statusCode).json(response);
            return;
        }

        const response = apiResponse(true, rental, 'Rental retrieved successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error retrieving rental', 500);
        res.status(response.statusCode).json(response);
    }
});

// Update rental by id
router.put('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const rental = await Rental.findById(id);

        if (!rental) {
            const response = apiResponse(false, null, 'Rental not found', 404);
            res.status(response.statusCode).json(response);
            return;
        }

        rental.user = req.body.user !== undefined ? req.body.user : rental.user;
        rental.scooter_id = req.body.scooter_id !== undefined ? req.body.scooter_id : rental.scooter_id;
        rental.startfee = req.body.startfee !== undefined ? req.body.startfee : rental.startfee;
        rental.destination_station = req.body.destination_station !== undefined ? req.body.destination_station : rental.destination_station;
        rental.start_time = req.body.start_time !== undefined ? req.body.start_time : rental.start_time;
        rental.end_time = req.body.end_time !== undefined ? req.body.end_time : rental.end_time;

        const updatedRental = await rental.save();
        const response = apiResponse(true, updatedRental, 'Rental updated successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error updating rental', 500);
        res.status(response.statusCode).json(response);
    }
});

// Delete rental by id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const rental = await Rental.findById(id);

        if (!rental) {
            const response = apiResponse(false, null, 'Rental not found', 404);
            res.status(response.statusCode).json(response);
            return;
        }

        const result = await Rental.deleteOne({ _id: id });

        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'Rental deleted successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error deleting rental', 500);
        res.status(response.statusCode).json(response);
    }
});

module.exports = router;
