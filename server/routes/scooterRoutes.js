// server/routes/scooterRoutes.js

const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const { findStation, apiResponse } = require('../utils.js');
const Scooter = require('../models/scooter.js');
const Station = require('../models/station.js');
const { default: mongoose } = require('mongoose');

// Middleware for validating request body for POST and PUT requests
const validateScooterBody = [
    body('status').notEmpty().withMessage('status is required'),
    body('model').notEmpty().withMessage('model is required'),
    body('station.name').notEmpty().withMessage('station name is required'),
    body('station.city').notEmpty().withMessage('station city is required'),
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

// Get all scooters
router.get('/', asyncHandler(async (req, res) => {
    const scooters = await Scooter.find();
    res.status(200).json(apiResponse(true, scooters, 'Scooters retrieved successfully', 200));
}));

// Add scooter
router.post('/', validateScooterBody, asyncHandler(async (req, res) => {
    const station = await findStation(req.body.station.name, req.body.station.city);

    if (!station) {
        return res.status(404).json(apiResponse(false, null, 'Station not found', 404));
    }

    const newScooter = new Scooter({
        status: req.body.status,
        model: req.body.model,
        station: {
            name: station.name,
            city: station.city.name,
            id: station._id
        },
        position: {
            lat: req.body.position?.lat || station.position.lat,
            lng: req.body.position?.lng || station.position.lng
        },
        log: req.body.log || []
    });

    const savedScooter = await newScooter.save();
    res.status(200).json(apiResponse(true, savedScooter, 'Scooter added successfully', 200));
}));

// Delete all scooters, only for dev and testing
router.delete('/', asyncHandler(async (req, res) => {
    const result = await Scooter.deleteMany();
    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Scooters deleted successfully', 200));
}));

// Get scooter by id
router.get('/:id', validateParam('id'), asyncHandler(async (req, res) => {
    const id = req.params.id;
    const scooter = await Scooter.findById(id);

    if (!scooter) {
        return res.status(404).json(apiResponse(false, null, 'Scooter not found', 404));
    }

    res.status(200).json(apiResponse(true, scooter, 'Scooter retrieved successfully', 200));
}));

// Update scooter by id
router.put('/:id', validateParam('id'), asyncHandler(async (req, res) => {
    const scooter = await Scooter.findById(req.params.id);

    if (!scooter) {
        return res.status(404).json(apiResponse(false, null, 'Scooter not found', 404));
    }

    scooter.set(req.body);
    const updatedScooter = await scooter.save();
    res.status(200).json(apiResponse(true, updatedScooter, 'Scooter updated successfully', 200));
}));

// Delete scooter by id
router.delete('/:id', validateParam('id'), asyncHandler(async (req, res) => {
    const result = await Scooter.deleteOne({ _id: req.params.id });

    if (!result.deletedCount) {
        return res.status(404).json(apiResponse(false, null, 'Scooter not found or already deleted', 404));
    }

    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Scooter deleted successfully', 200));
}));

module.exports = router;
