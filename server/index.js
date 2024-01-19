// server/index.js


require('dotenv').config();

// utils.js
const { apiResponse } = require("./utils.js");

// Routes
const v1CityRoutes = require('./routes/v1CityRoutes.js');
const v2CityRoutes = require('./routes/v2/v2CityRoutes.js');
const v1RentalRoutes = require('./routes/v1RentalRoutes.js');
const v2RentalRoutes = require('./routes/v2/v2RentalRoutes.js');
const v1StationRoutes = require('./routes/v1StationRoutes.js');
const v2StationRoutes = require('./routes/v2/v2StationRoutes.js');
const v1UserRoutes = require('./routes/v1userRoutes.js');
const v2UserRoutes = require('./routes/v2/v2userRoutes.js');
const v1LogRoutes = require('./routes/v1LogRoutes.js');
const v2LogRoutes = require('./routes/v2/v2LogRoutes.js');
const v1ScooterRoutes = require('./routes/v1ScooterRoutes.js');
const v2ScooterRoutes = require('./routes/v2/v2ScooterRoutes.js');
const Status = require('./models/status.js');
const User = require('./models/user.js');
const logger = require('./logger.js');

const cron = require('node-cron');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// API docs
require('./apiDocs')(app);

mongoose.connect('mongodb://root:secret@vteam-database-1:27017/vteam', {
    authSource: 'admin'
});

app.use(express.json());

// // Cron job to do monthly payments
// cron.schedule('0 0 * * *', async () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const users = await User.find({ 
//         role: 'ppm',
//         next_payment_date: { $lte: today }
//     });

//     for (const user of users) {
//         try {
//             if (user.credit_amount < 99) {
//                 user.role = 'ppu';
//                 user.next_payment_date = null;
//                 await user.save();
//                 throw new Error('Not enough credit, role changed to ppu');
//             }
//             user.credit_amount -= 99;
//             user.next_payment_date = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
//             await user.save();
//         }
//         catch (error) {
//             logger.error(error.message);
//         }
//     }
// });

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Allow-Methods', '*');
    next();
});

app.use('/city', v1CityRoutes);
app.use('/v2/city', v2CityRoutes);
app.use('/rent', v1RentalRoutes);
app.use('/v2/rent', v2RentalRoutes);
app.use('/station', v1StationRoutes);
app.use('/v2/station', v2StationRoutes);
app.use('/user', v1UserRoutes);
app.use('/v2/user', v2UserRoutes);
app.use('/log', v1LogRoutes);
app.use('/v2/log', v2LogRoutes);
app.use('/scooter', v1ScooterRoutes);
app.use('/v2/scooter', v2ScooterRoutes);

/**
 * @swagger
 * /:
 *  get:
 *    summary: Returns a list of all routes
 *    description: A list of all routes available in the API
 *    responses:
 *      200:
 *        description: A JSON array of route objects
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Route'
 *                message:
 *                  type: string
 *                statusCode:
 *                  type: integer
 *              required:
 *                - success
 *                - data
 *                - message
 *                - statusCode
 */
app.get('/', (req, res) => {
    const routes = require('./routes/routes.json');
    const response = apiResponse(true, routes, 'Routes fetched successfully', 200);
    res.status(response.statusCode).json(response); // Set the status code and send the JSON response
});

/**
 * @swagger
 * /status:
 *  get:
 *    summary: Returns a list of all statuses
 *    responses:
 *      '200':
 *        description: A list of all scooter statuses
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      status_code:
 *                        type: integer
 *                        description: Unique code for the status
 *                      status_name:
 *                        type: string
 *                        description: Name of the status
 *                      description:
 *                        type: string
 *                        description: Description of the status
 *                message:
 *                  type: string
 *                statusCode:
 *                  type: integer
 *              required:
 *                - success
 *                - data
 *                - message
 *                - statusCode
 */
app.get('/status', async (req, res) => {
    const rows = await Status.find();
    const response = apiResponse(true, rows, 'Status fetched successfully', 200);
    res.status(response.statusCode).json(response);
});


module.exports = app;
