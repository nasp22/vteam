// server/routes/userRoutes.js

const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const { apiResponse } = require('../utils.js');
const User = require('../models/user.js');
const { default: mongoose } = require('mongoose');

// Middleware for validating request body for POST and PUT requests
const validateUserBody = [
    body('status').notEmpty().withMessage('status is required'),
    body('role').notEmpty().withMessage('role is required'),
    body('credit_amount').notEmpty().withMessage('credit_amount is required'),
    body('email').notEmpty().withMessage('email is required'),
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

// Get all users
router.get('/', asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(apiResponse(true, users, 'Users retrieved successfully', 200));
}));

// Add user
router.post('/', validateUserBody, asyncHandler(async (req, res) => {
    const newUser = new User({
        auth_id: req.body.auth_id,
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
    res.status(201).json(apiResponse(true, user, 'User added successfully', 201));
}));

// Delete users
router.delete('/', asyncHandler(async (req, res) => {
    const result = await User.deleteMany();

    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Users deleted successfully', 200));
}));

// Get user by id
router.get('/:id', asyncHandler(async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        user = await User.findById(req.params.id);
    } else {
        user = await User.findOne({ auth_id: req.params.id });
    }

    if (!user) {
        return res.status(404).json(apiResponse(false, null, 'User not found', 404));
    }

    res.status(200).json(apiResponse(true, user, 'User retrieved successfully', 200));
}));

// Update user by id
router.put('/:id', validateParam('id'), asyncHandler(async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        user = await User.findById(req.params.id);
    } else {
        user = await User.findOne({ auth_id: req.params.id });
    }

    if (!user) {
        return res.status(404).json(apiResponse(false, null, 'User not found', 404));
    }

    user.set(req.body);
    const updatedUser = await user.save();
    res.status(200).json(apiResponse(true, updatedUser, 'User updated successfully', 200));
}));

// Delete user by id
router.delete('/:id', validateParam('id'), asyncHandler(async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        result = await User.deleteOne({ _id: req.params.id });
    } else {
        result = await User.deleteOne({ auth_id: req.params.id });
    }

    if (!result.deletedCount) {
        return res.status(404).json(apiResponse(false, null, 'User not found or already deleted', 404));
    }

    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'User deleted successfully', 200));
}));

module.exports = router;
