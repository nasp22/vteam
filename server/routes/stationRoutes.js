// server/routes/stationRoutes.js

const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const { apiResponse } = require('../utils.js');
const mongoose = require('mongoose');

const Station = require('../models/station.js');
const City = require('../models/city.js');
const Scooter = require('../models/scooter.js');

// Middleware for validating request body for POST and PUT requests
const validateStationBody = [
    body('name').notEmpty().withMessage('name is required'),
    body('scooters').isArray().withMessage('scooters must be an array'),
    body('position').notEmpty().withMessage('position is required'),
    body('city').notEmpty().withMessage('city is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(apiResponse(false, null, errors.array(), 400));
        }
        next();
    }
]

// Middleware for validating request parameters
const validateParam = (paramName) => [
    param(paramName).notEmpty().withMessage(`${paramName} is required`),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(apiResponse(false, null, errors.array(), 400));
        }
        next();
    }
];

// Middleware to handle async route errors
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Get all stations
/**
 * @swagger
 * /station:
 *   get:
 *     tags: [Station]
 *     summary: Retrieves all stations
 *     description: Fetches all stations from the database.
 *     responses:
 *       200:
 *         description: A list of stations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Station'
 */
router.get('/', asyncHandler(async (req, res) => {
    const stations = await Station.find();
    res.status(200).json(apiResponse(true, stations, 'Stations retrieved successfully', 200));
}));

// Create a station
/**
 * @swagger
 * /station:
 *   post:
 *     tags: [Station]
 *     summary: Add a new station
 *     description: Creates a new station.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StationInput'
 *     responses:
 *       201:
 *         description: Station created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 */
router.post('/', validateStationBody, asyncHandler(async (req, res) => {
    const { name, scooters, position, city } = req.body;

    let scooterList = [];
    for (const scooter of scooters) {
        const scooterExists = await Scooter.findById(scooter);
        if (!scooterExists) {
            return res.status(404).json(apiResponse(false, null, 'Scooter not found', 404));
        }
        const newScooter = {
            id: scooterExists._id,
            model: scooterExists.model,
            status: scooterExists.status
        }
        scooterList.push(newScooter);
    }

    let cityDetails = {};
    if (city.id) {
        cityDetails = await City.findById(city.id);
    } else {
        cityDetails = await City.findOne({ name: city.name });
    }

    if (!cityDetails) {
        return res.status(404).json(apiResponse(false, null, 'City not found', 404));
    }

    const newStation = new Station({
        name,
        scooters: scooterList,
        position,
        city: {
            name: cityDetails.name,
            id: cityDetails._id
        }
    });
    console.log(newStation);

    const station = await newStation.save();
    res.status(201).json(apiResponse(true, station, 'Station added successfully', 201));
}));


// Delete all stations, only for dev and testing
router.delete('/', asyncHandler(async (req, res) => {
    const result = await Station.deleteMany();

    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Stations deleted successfully', 200));
}));

// Get station by id
/**
 * @swagger
 * /station/{id}:
 *   get:
 *     tags: [Station]
 *     summary: Retrieve a specific station by ID
 *     description: Get details of a specific station by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the station to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Station retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 */
router.get('/:id', validateParam('id'), asyncHandler(async (req, res) => {
    let station;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        station = await Station.findById(req.params.id);
    } else {
        station = await Station.findOne({ name: req.params.id });
    }

    if (!station) {
        return res.status(404).json(apiResponse(false, null, 'Station not found', 404));
    }

    res.status(200).json(apiResponse(true, station, 'Station retrieved successfully', 200));
}));

// Update station by id
/**
 * @swagger
 * /station/{id}:
 *   put:
 *     tags: [Station]
 *     summary: Update a specific station by ID
 *     description: Updates the details of a specific station.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the station to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StationInput'
 *     responses:
 *       200:
 *         description: Station updated successfully.
 */
router.put('/:id', validateParam('id'), asyncHandler(async (req, res) => {
    const id = req.params.id;
    const station = await Station.findById(id);

    if (!station) {
        return res.status(404).json(apiResponse(false, null, 'Station not found', 404));
    }

    let { name, scooters, position, city } = req.body;

    if (scooters) {
        const scooterObjectIds = scooters.map(scooter => new mongoose.Types.ObjectId(scooter));

        for (const scooterId of scooterObjectIds) {
            const scooterExists = await Scooter.findById(scooterId);
            if (!scooterExists) {
                return res.status(404).json(apiResponse(false, null, 'Scooter not found', 404));
            }
        }
    } else {
        scooterObjectIds = station.scooters;
    }

    if (position) {
        if (!position.lat) {
            position.lat = station.position.lat;
        }
        if (!position.lng) {
            position.lng = station.position.lng;
        }
    } else {
        position = station.position;
    }

    if (city) {
        let cityDetails = {};
        if (city.id) {
            cityDetails = await City.findById(city.id);
        } else {
            cityDetails = await City.findOne({ name: city.name });
        }
    } else {
        cityDetails = station.city;
    }

    if (!name) {
        name = station.name;
    }

    console.log(name, scooterObjectIds, position, cityDetails)
    station.set({
        name,
        scooters: scooterObjectIds,
        position,
        city: {
            name: cityDetails.name,
            id: cityDetails.id
        }
    });

    const updatedStation = await station.save();
    res.status(200).json(apiResponse(true, updatedStation, 'Station updated successfully', 200));
}));

// Delete station by id
/**
 * @swagger
 * /station/{id}:
 *   delete:
 *     tags: [Station]
 *     summary: Delete a specific station by ID
 *     description: Deletes a station from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the station to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Station deleted successfully.
 */
router.delete('/:id', asyncHandler(async (req, res) => {
    result = await Station.deleteOne({ _id: req.params.id });

    if (!result.deletedCount) {
        return res.status(404).json(apiResponse(false, null, 'Station not found or already deleted', 404));
    }

    res.status(200).json(apiResponse(true, null, 'Station deleted successfully', 200));
}));

module.exports = router;
