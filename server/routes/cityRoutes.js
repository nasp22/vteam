// server/routes/cityRoutes.js

const express = require('express');
const router = express.Router();
const { apiResponse } = require('../utils.js');
const City = require('../models/city.js');

// Get all cities
router.get('/', async (req, res) => {
    try {
        const cities = await City.find();
        const response = apiResponse(true, cities, 'Cities retrieved successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error retrieving cities', 500);
        res.status(response.statusCode).json(response);
    }
});

// Get city by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        let city = await City.findOne({ name: id });

        if (city === null) {
            city = await City.findById(id);
        } else if (city === null) {
            const response = apiResponse(false, null, 'City not found', 404);
            res.status(response.statusCode).json(response);
            return;
        }

        const response = apiResponse(true, city, 'City retrieved successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error retrieving city', 500);
        res.status(response.statusCode).json(response);
    }
});

// Delete ctiies, only for dev and testing
router.delete('/', async (req, res) => {
    try {
        const result = await City.deleteMany();

        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'Cities deleted successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error deleting cities', 500);
        res.status(response.statusCode).json(response);
    }
});

module.exports = router;