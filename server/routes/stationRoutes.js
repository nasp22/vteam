// server/routes/stationRoutes.js

const express = require('express');
const router = express.Router();
const { apiResponse } = require('../utils.js');
const mongoose = require('mongoose');

const Station = require('../models/station.js');
const City = require('../models/city.js');
const Scooter = require('../models/scooter.js');

// Get all stations
router.get('/', async (req, res) => {
    try {
        const stations = await Station.find();
        const response = apiResponse(true, stations, 'Stations retrieved successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error retrieving stations', 500);
        res.status(response.statusCode).json(response);
    }
});

// Create a station
router.post('/', async (req, res) => {
    const { name, scooters, position, city } = req.body;

    if (!name || !scooters || !position || !city) {
        const response = apiResponse(false, null, 'Missing required fields', 400);
        res.status(response.statusCode).json(response);
        return;
    }

    let scooterObjectIds = [];
    if (scooters.length > 0) {
        for (const scooterId of scooters) {
            if (!mongoose.Types.ObjectId.isValid(scooterId)) {
                const response = apiResponse(false, null, 'Invalid scooter ID', 400);
                res.status(response.statusCode).json(response);
                return;
            }
            const scooterExists = await Scooter.findById(scooterId);
            if (!scooterExists) {
                const response = apiResponse(false, null, `Scooter not found: ${scooterId}`, 404);
                res.status(response.statusCode).json(response);
                return;
            }
            scooterObjectIds.push(new mongoose.Types.ObjectId(scooterId));
        }
    }

    try {
        let cityDetails = {};
        if (city.id) {
            cityDetails = await City.findById(city.id);
        } else if (city.name) {
            cityDetails = await City.findOne({ name: city.name });
        }

        if (!cityDetails) {
            const response = apiResponse(false, null, 'City not found', 404);
            res.status(response.statusCode).json(response);
            return;
        }


        const newStation = new Station({
            name,
            scooters,
            position,
            city: {
                name: cityDetails.name,
                id: cityDetails._id
            }
        });

        const result = await newStation.save();
        const response = apiResponse(true, result, 'Station created successfully', 201);
        res.status(response.statusCode).json(response);
    } catch (err) {
        console.log(err);
        const response = apiResponse(false, err, 'Error creating station', 500);
        res.status(response.statusCode).json(response);
    }
});

// Delete all stations, only for dev and testing
router.delete('/', async (req, res) => {
    try {
        const result = await Station.deleteMany();

        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'Stations deleted successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error deleting stations', 500);
        res.status(response.statusCode).json(response);
    }
});

// Get station by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const station = await Station.findById(id);

        if (!station) {
            const response = apiResponse(false, null, 'Station not found', 404);
            res.status(response.statusCode).json(response);
            return;
        }

        const response = apiResponse(true, station, 'Station retrieved successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error retrieving station', 500);
        res.status(response.statusCode).json(response);
    }
});

// Update station by id
router.put('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const station = await Station.findById(id);

        if (!station) {
            const response = apiResponse(false, null, 'Station not found', 404);
            res.status(response.statusCode).json(response);
            return;
        }

        station.name = req.body.name || station.name;
        station.scooter_quantity = req.body.scooter_quantity || station.scooter_quantity;
        station.position = req.body.position || station.position;

        if (req.body.city) {
            const cityCriteria = req.body.city.id ? { _id: req.body.city.id } : { name: req.body.city.name };
            const city = await City.findOne(cityCriteria);

            if (city) {
                station.city.id = city._id;
                station.city.name = city.name;
            } else {
                const response = apiResponse(false, null, 'City not found', 404);
                res.status(response.statusCode).json(response);
                return;
            }
        }
        const result = await station.save();
        const response = apiResponse(true, result, 'Station updated successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error updating station', 500);
        res.status(response.statusCode).json(response);
    }
});

// Delete station by id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const station = await Station.findById(id);

        if (!station) {
            const response = apiResponse(false, null, 'Station not found', 404);
            res.status(response.statusCode).json(response);
            return;
        }

        const result = await Station.deleteOne({ _id: id });

        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'Station deleted successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        console.log(err);
        const response = apiResponse(false, err, 'Error deleting station', 500);
        res.status(response.statusCode).json(response);
    }
});

module.exports = router;
