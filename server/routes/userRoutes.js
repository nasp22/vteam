// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { apiResponse } = require('../utils.js');
const User = require('../models/user.js');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        const response = apiResponse(true, users, 'Users retrieved successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error retrieving users', 500);
        res.status(response.statusCode).json(response);
    }
});

// Add user
router.post('/', async (req, res) => {
    try {
        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            status: req.body.status,
            role: req.body.role,
            credit_amount: req.body.credit_amount,
            phone_number: req.body.phone_number,
            email: req.body.email,
            log: req.body.log || []
        });

        const user = await newUser.save();

        const response = apiResponse(true, user, 'User added successfully', 201);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error adding user', 500);
        res.status(response.statusCode).json(response);
    }
});

// Delete users
router.delete('/', async (req, res) => {
    try {
        const result = await User.deleteMany();

        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'Users deleted successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error deleting users', 500);
        res.status(response.statusCode).json(response);
    }
});

// Get user by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id);
        const response = apiResponse(true, user, 'User retrieved successfully', 200);

        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error retrieving user', 500);
        res.status(response.statusCode).json(response);
    }
});

// Update user by id
router.put('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id);

        if (user === null) {
            const response = apiResponse(false, null, 'User not found', 404);
            res.status(response.statusCode).json(response);
            return;
        }

        user.first_name = req.body.first_name || user.first_name;
        user.last_name = req.body.last_name || user.last_name;
        user.status = req.body.status || user.status;
        user.role = req.body.role || user.role;
        user.credit_amount = req.body.credit_amount || user.credit_amount;
        user.phone_number = req.body.phone_number || user.phone_number;
        user.email = req.body.email || user.email;
        if (req.body.log) {
            user.log.push(req.body.log);
        } else {
            user.log = user.log;
        }

        const updatedUser = await user.save();
        const response = apiResponse(true, updatedUser, 'User updated successfully', 200);

        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error updating user', 500);
        res.status(response.statusCode).json(response);
    }
});

// Delete user by id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await User.deleteOne({ _id: id });

        if (result === null) {
            const response = apiResponse(false, null, 'User not found', 404);
            res.status(response.statusCode).json(response);
            return;
        }
        const response = apiResponse(true, { deletedCount: 1 }, 'User deleted successfully');

        res.status(response.statusCode).json(response);
    } catch (err) {
        const response = apiResponse(false, err, 'Error deleting user', 500);

        res.status(response.statusCode).json(response);
    }
});

module.exports = router;
