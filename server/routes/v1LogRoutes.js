// server/routes/v1LogRoutes.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { apiResponse, findStation } = require('../utils.js');
const Log = require('../models/log.js');
const Station = require('../models/station.js');
const { mongo, default: mongoose } = require('mongoose');
const { validate } = require('../models/city.js');

// Middleware for validating request body
const validateLogBody = (reqType) => {
    return [
        body(`${reqType}_position.lat`).notEmpty().withMessage(`'${reqType} position is required'`),
        body(`${reqType}_position.lng`).notEmpty().withMessage(`'${reqType} position is required'`),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(apiResponse(false, null, errors.array(), 400));
            }
            next();
        }
    ];
};

// Middleware to handle async route errors
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Get all logs
/**
 * @swagger
 * /log:
 *   get:
 *     tags: [Logs]
 *     summary: Retrieves all logs
 *     description: Fetches all transportation logs from the database.
 *     responses:
 *       200:
 *         description: A list of logs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 */
router.get('/', asyncHandler(async (req, res) => {
    try {
        const logs = await Log.find();
        res.status(200).json(apiResponse(true, logs, 'Logs retrieved successfully', 200));
    } catch (err) {
        res.status(500).json(apiResponse(false, null, err.message, 500));
    }
}));

// Add log
/**
 * @swagger
 * /log:
 *   post:
 *     tags: [Logs]
 *     summary: Add a new log
 *     description: Creates a new log for a transportation event.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogPost'
 *     responses:
 *       200:
 *         description: Log created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Log'
 *       404:
 *         description: Station not found.
 */
router.post('/', validateLogBody('start'), asyncHandler(async (req, res) => {
    const newLog = new Log({
        start_position: {
            lat: req.body.start_position.lat,
            lng: req.body.start_position.lng
        },
        end_position: req.body.end_position || {
            lat: null,
            lng: null
        },
        from_time: req.body.from_time || null,
        to_time: req.body.to_time || null
    });

    const savedLog = await newLog.save();
    res.status(200).json(apiResponse(true, savedLog, 'Log added successfully', 200));
}));

// Delete logs, only for dev and testing
/**
 * @swagger
 * /log:
 *   delete:
 *     tags: [Logs]
 *     summary: Deletes all logs
 *     description: Deletes all transportation logs from the database. Intended for development and testing purposes.
 *     responses:
 *       200:
 *         description: All logs deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *                   description: The number of logs deleted.
 */
router.delete('/', asyncHandler(async (req, res) => {
    const result = await Log.deleteMany();
    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Logs deleted successfully', 200));
}));

// Get log by id
/**
 * @swagger
 * /log/{id}:
 *  get:
 *    tags: [Logs]
 *    summary: Retrieve a specific log by ID
 *    description: Get details of a specific log by its ID.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the log to retrieve.
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Log retrieved successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Log'
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const log = await Log.findById(id);

    if (!log) {
        return res.status(404).json(apiResponse(false, null, 'Log not found', 404));
    }

    res.status(200).json(apiResponse(true, log, 'Log retrieved successfully', 200));
}));

// Update log by id
/**
 * @swagger
 * /log/{id}:
 *  put:
 *    tags: [Logs]
 *    summary: Update a log by ID
 *    description: Update details of a specific log by its ID.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the log to update.
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              from_station:
 *                type: object
 *              to_station:
 *                type: object
 *              from_time:
 *                type: string
 *                format: date-time
 *              to_time:
 *                type: string
 *                format: date-time
 *    responses:
 *      200:
 *        description: Log updated successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Log'
 */
router.put('/:id',
    asyncHandler(async (req, res) => {
        try {
            const id = req.params.id;
            let log = await Log.findById(id);

            if (!log) {
                return res.status(404).json(apiResponse(false, null, 'Log not found', 404));
            }
            // if (!req.body.start_position) {
            //     req.body.start_position = {};
            // }
            // if (!req.body.end_position) {
            //     req.body.end_position = {};
            // }
            // log.start_position.lat = req.body.start_position.lat || log.start_position.lat;
            // log.start_position.lng = req.body.start_position.lng || log.start_position.lng;
            // log.end_position.lat = req.body.end_position.lat || log.end_position.lat;
            // log.end_position.lng = req.body.end_position.lng || log.end_position.lng;
            // log.from_time = req.body.from_time || log.from_time;
            // log.to_time = req.body.to_time || log.to_time;

            const logData = log.toObject ? log.toObject() : log;

            log = new Log({
                ...logData,
                ...req.body
            });

            const updatedLog = await log.save();
            res.status(200).json(apiResponse(true, updatedLog, 'Log updated successfully', 200));
        } catch (err) {
            res.status(500).json(apiResponse(false, null, err.message, 500));
        }
    })
);

// Delete log by id
/**
 * @swagger
 * /log/{id}:
 *  delete:
 *    tags: [Logs]
 *    summary: Delete a specific log by ID
 *    description: Deletes a specific log from the database by its ID.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the log to delete.
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Log deleted successfully.
 */
router.delete('/:id', asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Log.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json(apiResponse(false, null, 'Log not found or already deleted', 404));
        }

        res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Log deleted successfully', 200));
    } catch (err) {
        // console.error(err); // For debugging purposes
        res.status(500).json(apiResponse(false, null, err.message, 500));
    }
}));

module.exports = router;
