// server/routes/v1userRoutes.js

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
/**
 * @swagger
 * /user:
 *   get:
 *     tags: [User]
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(apiResponse(true, users, 'Users retrieved successfully', 200));
}));

// Add user
/**
 * @swagger
 * /user:
 *   post:
 *     tags: [User]
 *     summary: Add a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User added successfully
 */
router.post('/', validateUserBody, asyncHandler(async (req, res) => {
    let next_payment_date = null;
    if (req.body.role == 'ppm') {
        const today = new Date();
        next_payment_date = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    }
    const newUser = new User({
        auth_id: req.body.auth_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        status: req.body.status,
        role: req.body.role,
        next_payment_date: next_payment_date,
        credit_amount: req.body.credit_amount,
        phone_number: req.body.phone_number,
        email: req.body.email,
        log: req.body.log || []
    });

    const user = await newUser.save();
    res.status(201).json(apiResponse(true, user, 'User added successfully', 201));
}));

// Delete users
/**
 * @swagger
 * /user:
 *   delete:
 *     tags: [User]
 *     summary: Delete all users
 *     responses:
 *       200:
 *         description: Users deleted successfully
 */
router.delete('/', asyncHandler(async (req, res) => {
    const result = await User.deleteMany();

    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Users deleted successfully', 200));
}));

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Details of the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/:id', asyncHandler(async (req, res) => {
    let user;
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

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     tags: [User]
 *     summary: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:id', validateParam('id'), asyncHandler(async (req, res) => {
    let user;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        user = await User.findById(req.params.id);
    } else {
        user = await User.findOne({ auth_id: req.params.id });
    }

    if (!user) {
        return res.status(404).json(apiResponse(false, null, 'User not found', 404));
    }
    if (req.body.role == 'ppm') {
        const today = new Date();
        req.body.next_payment_date = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    }

    user.set(req.body);
    const updatedUser = await user.save();
    res.status(200).json(apiResponse(true, updatedUser, 'User updated successfully', 200));
}));

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found or already deleted
 */
router.delete('/:id', validateParam('id'), asyncHandler(async (req, res) => {
    let result;
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
