// server/routes/v2ScooterRoutes.js

const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const { findStation, apiResponse } = require('../utils.js');
const Scooter = require('../models/scooter.js');
const Station = require('../models/station.js');
const { default: mongoose } = require('mongoose');
const { authenticateToken, checkRole} = require('../middleware/authMiddleware.js');

// Middleware for validating request body for POST and PUT requests
const validateScooterBody = [
    body('status').notEmpty().withMessage('status is required'),
    body('model').notEmpty().withMessage('model is required'),
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

// Get all scooters
/**
 * @swagger
 * /scooter:
 *   get:
 *     tags: [Scooter]
 *     summary: Retrieves all scooters
 *     responses:
 *       200:
 *         description: A list of scooters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Scooter'
 */
router.get('/', asyncHandler(async (req, res) => {
    const scooters = await Scooter.find();
    res.status(200).json(apiResponse(true, scooters, 'Scooters retrieved successfully', 200));
}));

// Add scooter
/**
 * @swagger
 * /scooter:
 *   post:
 *     tags: [Scooter]
 *     summary: Add a new scooter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScooterInput'
 *     responses:
 *       200:
 *         description: Scooter added successfully.
 */
router.post('/', authenticateToken, checkRole('admin'), validateScooterBody, asyncHandler(async (req, res) => {
    let station = null;
    if (req.body.station) {
        station = await findStation(req.body.station.name, req.body.station.city);

        if (!station) {
            return res.status(404).json(apiResponse(false, null, 'Station not found', 404));
        }
    }

    const newScooter = new Scooter({
        status: req.body.status,
        model: req.body.model,
        city: req.body.city,
        station: {
            name: req.body.station?.name || null,
            id: station?._id || null,
            city: req.body.station?.city || null
        },
        position: {
            lat: req.body.position?.lat || 0,
            lng: req.body.position?.lng || 0
        },
        log: req.body.log || []
    });

    if (station) {
        newScooter.station = {
            name: station.name,
            id: station._id,
            city: station.city.name
        };
        if (newScooter.position.lat === 0 && newScooter.position.lng === 0) {
            newScooter.position.lat = station.position.lat;
            newScooter.position.lng = station.position.lng;
        }
    }

    const savedScooter = await newScooter.save();
    res.status(200).json(apiResponse(true, savedScooter, 'Scooter added successfully', 200));
}));

// Delete all scooters, only for dev and testing
/**
 * @swagger
 * /scooter:
 *   delete:
 *     tags: [Scooter]
 *     summary: Delete all scooters
 *     description: Deletes all scooters from the database. Only for development and testing purposes.
 *     responses:
 *       200:
 *         description: All scooters deleted successfully.
 */
router.delete('/', authenticateToken, checkRole('admin'), asyncHandler(async (req, res) => {
    const result = await Scooter.deleteMany();
    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Scooters deleted successfully', 200));
}));

// Get scooter by id
/**
 * @swagger
 * /scooter/{id}:
 *   get:
 *     tags: [Scooter]
 *     summary: Get a scooter by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the scooter to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scooter retrieved successfully.
 */
router.get('/:id', validateParam('id'), asyncHandler(async (req, res) => {
    const id = req.params.id;
    const scooter = await Scooter.findById(id);

    if (!scooter) {
        return res.status(404).json(apiResponse(false, null, 'Scooter not found', 404));
    }

    res.status(200).json(apiResponse(true, scooter, 'Scooter retrieved successfully', 200));
}));

// Update scooter by id
/**
 * @swagger
 * /scooter/{id}:
 *   put:
 *     tags: [Scooter]
 *     summary: Update a scooter by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the scooter to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScooterInput'
 *     responses:
 *       200:
 *         description: Scooter updated successfully.
 */
router.put('/:id', authenticateToken, checkRole('admin'), validateParam('id'), asyncHandler(async (req, res) => {
    const scooter = await Scooter.findById(req.params.id);

    if (!scooter) {
        return res.status(404).json(apiResponse(false, null, 'Scooter not found', 404));
    }
    if (req.body.station) {
        if (req.body.station.name === null) {
            req.body.station = {
                name: null,
                id: null,
                city: null
            };
        } else {
            const station = await findStation(req.body.station.name, req.body.station.city);

            if (!station) {
                return res.status(404).json(apiResponse(false, null, 'Station not found', 404));
            }
            const stationId = station._id.toString();

            req.body.station = {
                name: station.name,
                id: stationId,
                city: station.city.name
            };
        }
    }
    scooter.set(req.body);
    const updatedScooter = await scooter.save();

    res.status(200).json(apiResponse(true, updatedScooter, 'Scooter updated successfully', 200));
}));

// Delete scooter by id
/**
 * @swagger
 * /scooter/{id}:
 *   delete:
 *     tags: [Scooter]
 *     summary: Delete a scooter by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the scooter to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Scooter deleted successfully.
 */
router.delete('/:id', authenticateToken, checkRole('admin'), validateParam('id'), asyncHandler(async (req, res) => {
    const result = await Scooter.deleteOne({ _id: req.params.id });

    if (!result.deletedCount) {
        return res.status(404).json(apiResponse(false, null, 'Scooter not found or already deleted', 404));
    }

    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Scooter deleted successfully', 200));
}));

module.exports = router;
