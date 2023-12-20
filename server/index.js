// server/index.js
const { apiResponse } = require("./utils.js");
const cityRoutes = require('./routes/cityRoutes.js');
const rentalRoutes = require('./routes/rentalRoutes.js');
const stationRoutes = require('./routes/stationRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const logRoutes = require('./routes/logRoutes.js');
const scooterRoutes = require('./routes/scooterRoutes.js');

const Status = require('./models/status.js');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const port= 1337;

mongoose.connect('mongodb://root:secret@vteam-database-1:27017/vteam', {
    authSource: 'admin'
});

app.use(express.json());
app.use('/city', cityRoutes);
app.use('/rent', rentalRoutes);
app.use('/station', stationRoutes);
app.use('/user', userRoutes);
app.use('/log', logRoutes);
app.use('/scooter', scooterRoutes);

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', '*');
    next();
});

app.get('/', (req, res) => {
    const routes = require('./routes/routes.json');
    const response = apiResponse(true, routes, 'Routes fetched successfully', 200);
    res.status(response.statusCode).json(response); // Set the status code and send the JSON response
});

app.get('/status', async (req, res) => {
    const rows = await Status.find();
    const response = apiResponse(true, rows, 'Status fetched successfully', 200);
    res.status(response.statusCode).json(response); // Set the status code and send the JSON response
});

app.listen(port, () => console.log(`Elspackcyklar-app listening on port ${port}!`));
