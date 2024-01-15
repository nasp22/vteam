// server/routes/v2LogRoutes.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { apiResponse, findStation } = require('../utils.js');
const Log = require('../models/log.js');
const Station = require('../models/station.js');
const { mongo, default: mongoose } = require('mongoose');
const { authenticateToken, checkRole} = require('../middleware/authMiddleware.js');

// Middleware for validating request body
const validateLogBody = (reqType) => {
    return [
        body(`${reqType}_station.name`).notEmpty().withMessage(`'${reqType} station name is required'`),
        body(`${reqType}_station.city`).notEmpty().withMessage(`'${reqType} station city is required'`),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(apiResponse(false, null, errors.array(), 400));
            }
            next();
        }
    ];
};

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

// Middleware to handle async route errors
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Get all logs
/**
 * @swagger
 * /v2/log:
 *   get:
 *     tags: [v2, Logs]
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
    const logs = await Log.find();
    res.status(200).json(apiResponse(true, logs, 'Logs retrieved successfully', 200));
}));

// Add log
/**
 * @swagger
 * /v2/log:
 *   post:
 *     security:
 *     - bearerAuth: []
 *     tags: [v2, Logs]
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
router.post('/', authenticateToken, validateLogBody('from'), validateLogBody('to'), asyncHandler(async (req, res) => {
    let fromStation;
    if (mongoose.Types.ObjectId.isValid(req.body.from_station.id)) {
        fromStation = await Station.findById(req.body.from_station.id);
        if (!fromStation) {
            return res.status(404).json(apiResponse(false, null, 'From station not found', 404));
        }
    } else {
        fromStation = await findStation(req.body.from_station.name, req.body.from_station.city);
        if (!fromStation) {
            return res.status(404).json(apiResponse(false, null, 'From station not found', 404));
        }
    }

    let toStation;
    if (mongoose.Types.ObjectId.isValid(req.body.to_station.id)) {
        toStation = await Station.findById(req.body.to_station.id);
        if (!toStation) {
            return res.status(404).json(apiResponse(false, null, 'To station not found', 404));
        }
    } else {
        toStation = await findStation(req.body.to_station.name, req.body.to_station.city);
        if (!toStation) {
            return res.status(404).json(apiResponse(false, null, 'To station not found', 404));
        }
    }

    const newLog = new Log({
        from_station: {
            name: fromStation.name,
            city: fromStation.city.name,
            id: fromStation._id
        },
        to_station: {
            name: toStation.name,
            city: toStation.city.name,
            id: toStation._id
        },
        from_time: req.body.from_time,
        to_time: req.body.to_time
    });

    const savedLog = await newLog.save();
    res.status(200).json(apiResponse(true, savedLog, 'Log added successfully', 200));
}));

// Delete logs, only for dev and testing
/**
 * @swagger
 * /v2/log:
 *   delete:
 *     security:
 *     - bearerAuth: []
 *     tags: [v2, Logs]
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
router.delete('/', authenticateToken, checkRole('admin'), asyncHandler(async (req, res) => {
    const result = await Log.deleteMany();
    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Logs deleted successfully', 200));
}));

// Get log by id
/**
 * @swagger
 * /v2/log/{id}:
 *  get:
 *    tags: [v2, Logs]
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
 * /v2/log/{id}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    tags: [v2, Logs]
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
router.put('/:id', authenticateToken,
    validateLogBody('from'), 
    validateLogBody('to'), 
    asyncHandler(async (req, res) => {
        const id = req.params.id;
        const log = await Log.findById(id);

        if (!log) {
            return res.status(404).json(apiResponse(false, null, 'Log not found', 404));
        }

        log.from_station = req.body.from_station || log.from_station;
        log.to_station = req.body.to_station || log.to_station;
        log.from_time = req.body.from_time || log.from_time;
        log.to_time = req.body.to_time || log.to_time;

        const updatedLog = await log.save();
        res.status(200).json(apiResponse(true, updatedLog, 'Log updated successfully', 200));
    })
);

// Delete log by id
/**
 * @swagger
 * /v2/log/{id}:
 *  delete:
 *    security:
 *     - bearerAuth: []
 *    tags: [v2, Logs]
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
router.delete('/:id', authenticateToken, checkRole('admin'), asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await Log.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
        return res.status(404).json(apiResponse(false, null, 'Log not found or already deleted', 404));
    }

    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Log deleted successfully', 200));
}));

module.exports = router;
