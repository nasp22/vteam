// server/routes/cityRoutes.js

const express = require('express');
const { param, validationResult } = require('express-validator');
const router = express.Router();
const { apiResponse } = require('../utils.js');
const City = require('../models/city.js');

// Middleware for validating request parameters
const validateParam = (paramName) => {
    return [
        param(paramName).notEmpty().withMessage(`${paramName} is required`),
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

// Get all cities
router.get('/', asyncHandler(async (req, res) => {
    const cities = await City.find();
    res.status(200).json(apiResponse(true, cities, 'Cities retrieved successfully', 200));
}));

// Get city by id
router.get('/:id', validateParam('id'), asyncHandler(async (req, res) => {
    const id = req.params.id;
    const city = await City.findById(id);

    if (!city) {
        return res.status(404).json(apiResponse(false, null, 'City not found', 404));
    }

    res.status(200).json(apiResponse(true, city, 'City retrieved successfully', 200));
}));

// Delete cities, only for dev and testing
router.delete('/', asyncHandler(async (req, res) => {
    const result = await City.deleteMany();
    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Cities deleted successfully', 200));
}));

module.exports = router;
