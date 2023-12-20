// server/routes/logRoutes.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { apiResponse, findStation } = require('../utils.js');
const Log = require('../models/log.js');
const Station = require('../models/station.js'); // Assuming you have a Station model

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

// Middleware to handle async route errors
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Get all logs
router.get('/', asyncHandler(async (req, res) => {
    const logs = await Log.find();
    res.status(200).json(apiResponse(true, logs, 'Logs retrieved successfully', 200));
}));

// Add log
router.post('/', validateLogBody('from'), validateLogBody('to'), asyncHandler(async (req, res) => {
    const fromStation = await findStation(req.body.from_station.name, req.body.from_station.city);
    const toStation = await findStation(req.body.to_station.name, req.body.to_station.city);

    if (!fromStation || !toStation) {
        return res.status(404).json(apiResponse(false, null, 'Station not found', 404));
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
router.delete('/', asyncHandler(async (req, res) => {
    const result = await Log.deleteMany();
    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Logs deleted successfully', 200));
}));

// Get log by id
router.get('/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const log = await Log.findById(id);

    if (!log) {
        return res.status(404).json(apiResponse(false, null, 'Log not found', 404));
    }

    res.status(200).json(apiResponse(true, log, 'Log retrieved successfully', 200));
}));

// Update log by id
router.put('/:id', 
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
router.delete('/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await Log.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
        return res.status(404).json(apiResponse(false, null, 'Log not found or already deleted', 404));
    }

    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Log deleted successfully', 200));
}));

module.exports = router;
