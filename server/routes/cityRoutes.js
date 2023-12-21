// server/routes/cityRoutes.js

const express = require('express');
const { param, validationResult } = require('express-validator');
const router = express.Router();
const { apiResponse } = require('../utils.js');
const City = require('../models/city.js');
const { default: mongoose } = require('mongoose');

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
/**
 * @swagger
 * /city:
 *   get:
 *     tags: [City]
 *     summary: Returns a list of all cities
 *     responses:
 *       '200':
 *         description: A list of all cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 */
router.get('/', asyncHandler(async (req, res) => {
    const cities = await City.find();
    res.status(200).json(apiResponse(true, cities, 'Cities retrieved successfully', 200));
}));

// Get city by id
/**
 * @swagger
 * /city/{id}:
 *  get:
 *    tags: [City]
 *    summary: Retrieve a specific city by ID or name
 *    description: Retrieve a city either by its MongoDB ObjectId or by its name. 
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: MongoDB ObjectId or name of the city to retrieve.
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: City retrieved successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/City'
 *      404:
 *        description: City not found.
 */
router.get('/:id', validateParam('id'), asyncHandler(async (req, res) => {
    const id = req.params.id;

    let city;
    if (mongoose.Types.ObjectId.isValid(id)) {
        city = await City.findById(id);
    } else {
        city = await City.findOne({ name: id });
    }

    if (!city) {
        return res.status(404).json(apiResponse(false, null, 'City not found', 404));
    }

    res.status(200).json(apiResponse(true, city, 'City retrieved successfully', 200));
}));

// Delete cities, only for dev and testing
/**
 * @swagger
 * /city:
 *  delete:
 *    tags: [City]
 *    summary: Deletes all cities from the database
 *    description: Use this route to delete all cities from the database. Intended for development and testing purposes.
 *    responses:
 *      200:
 *        description: All cities deleted successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                deletedCount:
 *                  type: integer
 *                  description: The number of cities deleted.
 */
router.delete('/', asyncHandler(async (req, res) => {
    const result = await City.deleteMany();
    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Cities deleted successfully', 200));
}));

module.exports = router;
