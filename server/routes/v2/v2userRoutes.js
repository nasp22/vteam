// server/routes/v2userRoutes.js

const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const { apiResponse } = require('../../utils.js');
const User = require('../../models/user.js');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, checkRole} = require('../../middleware/authMiddleware.js');

// Middleware for validating request body for POST and PUT requests
const validateUserBody = [
    body('status').notEmpty().withMessage('status is required'),
    body('role').notEmpty().withMessage('role is required'),
    body('credit_amount').notEmpty().withMessage('credit_amount is required'),
    body('email').notEmpty().withMessage('email is required'),
    body('password').notEmpty().withMessage('password is required'),
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


// Log in
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json(apiResponse(false, null, 'User not found', 404));
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.status(200).json(apiResponse(true, { token: token }, 'User logged in successfully', 200));
        } else {
            res.status(401).json(apiResponse(false, null, 'Incorrect password', 401));
        }
    } catch (error) {
        res.status(500).json(apiResponse(false, null, error.message, 500));
    }
}));

// Get all users
/**
 * @swagger
 * v2/user:
 *   get:
 *     tags: [v2, User]
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
 * v2/user:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [v2, User]
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
router.post('/', authenticateToken, checkRole('admin'), validateUserBody, asyncHandler(async (req, res) => {
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
        password: await bcrypt.hash(req.body.password, 10),
        log: req.body.log || []
    });

    const user = await newUser.save();
    res.status(201).json(apiResponse(true, user, 'User added successfully', 201));
}));

// Delete users
/**
 * @swagger
 * v2/user:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [v2, User]
 *     summary: Delete all users
 *     responses:
 *       200:
 *         description: Users deleted successfully
 */
router.delete('/', authenticateToken, checkRole('admin'), asyncHandler(async (req, res) => {
    const result = await User.deleteMany();

    res.status(200).json(apiResponse(true, { deletedCount: result.deletedCount }, 'Users deleted successfully', 200));
}));

/**
 * @swagger
 * v2/user/{id}:
 *   get:
 *     tags: [v2, User]
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
 * v2/user/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [v2, User]
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
router.put('/:id', authenticateToken, checkRole('admin'), validateParam('id'), asyncHandler(async (req, res) => {
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
 * v2/user/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [v2, User]
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
router.delete('/:id', authenticateToken, checkRole('admin'), validateParam('id'), asyncHandler(async (req, res) => {
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
