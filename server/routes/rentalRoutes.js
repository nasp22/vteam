// server/routes/rentalRoutes.js

const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const { findStation, findScooter, apiResponse } = require('../utils.js');
const Rental = require('../models/rental.js');
const User = require('../models/user.js');
const { default: mongoose } = require('mongoose');

// Middleware for validating request body for POST and PUT requests
const validateRentalBody = [
    body('startfee').notEmpty().withMessage('startfee is required'),
    body('destination_station.name').notEmpty().withMessage('destination_station.name is required'),
    body('destination_station.city').notEmpty().withMessage('destination_station.city is required'),
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


// Get all rentals
router.get('/', asyncHandler(async (req, res) => {
    const rentals = await Rental.find();
    res.status(200).json(apiResponse(true, rentals, 'Rentals retrieved successfully', 200));
}));

// Delete all rentals
router.delete('/', asyncHandler(async (req, res) => {
    const result = await Rental.deleteMany();
    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Rentals deleted successfully', 200));
}));

// Create a rental
router.post('/:scooter_id/:user_id', validateRentalBody, asyncHandler (async (req, res) => {
    const scooter = await findScooter(req.params.scooter_id);
    if (!scooter) {
        const response = apiResponse(false, null, 'Scooter not found', 404);
        res.status(response.statusCode).json(response);
        return;
    }

    let user;
    if (mongoose.Types.ObjectId.isValid(req.params.user_id)) {
        console.log('valid');
        user = await User.findById(req.params.user_id);
    } else {
        console.log('not valid');
        user = await User.findOne({ auth_id: req.params.user_id });
    }
    console.log(user);
    if (!user) {
        const response = apiResponse(false, null, 'User not found', 404);
        res.status(response.statusCode).json(response);
        return;
    }

    const station = await findStation(req.body.destination_station.name, req.body.destination_station.city);
    if (!station) {
        const response = apiResponse(false, null, 'Destination station not found', 404);
        res.status(response.statusCode).json(response);
        return;
    }

    const newRental = new Rental({
        user: {
            first_name: user.first_name,
            last_name: user.last_name,
            id: user._id
        },
        scooter_id: scooter._id,
        startfee: req.body.startfee,
        destination_station: {
            name: station.name,
            city: station.city.name,
            id: station._id
        },
        start_time: req.body.start_time || Date.now(),
        end_time: req.body.end_time || null
    });

    const rental = await newRental.save();
    res.status(201).json(apiResponse(true, rental, 'Rental added successfully', 201));
}));

// Get rental by id
router.get('/:id', asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
        const response = apiResponse(false, null, 'Rental not found', 404);
        res.status(response.statusCode).json(response);
        return;
    }

    res.status(200).json(apiResponse(true, rental, 'Rental retrieved successfully', 200));
}));

// Update rental by id
router.put('/:id', validateParam('id'), asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
        const response = apiResponse(false, null, 'Rental not found', 404);
        res.status(response.statusCode).json(response);
        return;
    }

    rental.set(req.body);
    const updatedRental = await rental.save();
    res.status(200).json(apiResponse(true, updatedRental, 'Rental updated successfully', 200));
}));

// Delete rental by id
router.delete('/:id', asyncHandler(async (req, res) => {
    const result = await Rental.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
        const response = apiResponse(false, null, 'Rental not found', 404);
        res.status(response.statusCode).json(response);
        return;
    }

    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Rental deleted successfully', 200));
}));

module.exports = router;
