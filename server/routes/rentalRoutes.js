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
/**
 * @swagger
 * /rent:
 *   get:
 *     tags: [Rental]
 *     summary: Retrieves all rentals
 *     responses:
 *       200:
 *         description: A list of rentals.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rental'
 */
router.get('/', asyncHandler(async (req, res) => {
    const rentals = await Rental.find();
    res.status(200).json(apiResponse(true, rentals, 'Rentals retrieved successfully', 200));
}));

// Delete all rentals
/**
 * @swagger
 * /rent:
 *   delete:
 *     tags: [Rental]
 *     summary: Delete all rentals
 *     description: Deletes all rentals from the database.
 *     responses:
 *       200:
 *         description: All rentals deleted successfully.
 */
router.delete('/', asyncHandler(async (req, res) => {
    const result = await Rental.deleteMany();
    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Rentals deleted successfully', 200));
}));

// Create a rental
/**
 * @swagger
 * /rent/{scooter_id}/{user_id}:
 *   post:
 *     tags: [Rental]
 *     summary: Create a new rental
 *     parameters:
 *       - in: path
 *         name: scooter_id
 *         required: true
 *         description: ID of the scooter being rented.
 *         schema:
 *           type: string
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID of the user renting the scooter.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RentalInput'
 *     responses:
 *       201:
 *         description: Rental created successfully.
 */
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
        start_time: req.body.start_time || Date.now(),
        end_time: req.body.end_time || null
    });

    const rental = await newRental.save();
    res.status(201).json(apiResponse(true, rental, 'Rental added successfully', 201));
}));

// Get rental by id
/**
 * @swagger
 * /rent/{id}:
 *   get:
 *     tags: [Rental]
 *     summary: Get a rental by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the rental to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rental retrieved successfully.
 */
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
/**
 * @swagger
 * /rent/{id}:
 *   put:
 *     tags: [Rental]
 *     summary: Update a rental by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the rental to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RentalInput'
 *     responses:
 *       200:
 *         description: Rental updated successfully.
 */
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
/**
 * @swagger
 * /rent/{id}:
 *   delete:
 *     tags: [Rental]
 *     summary: Delete a rental by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the rental to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rental deleted successfully.
 */
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
