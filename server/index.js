// server/index.js
const { apiResponse } = require("./utils.js");
const cityRoutes = require('./routes/cityRoutes.js');
const rentalRoutes = require('./routes/rentalRoutes.js');
const stationRoutes = require('./routes/stationRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const logRoutes = require('./routes/logRoutes.js');

const Scooter = require('./models/scooter.js');
const Station = require('./models/station.js');
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

app.get('/scooter', async (req, res) => {
    const scooters = await Scooter.find();
    const response = apiResponse(true, scooters, 'Scooters fetched successfully', 200);
    res.status(response.statusCode).json(response);
}
);

app.post('/scooter', async (req, res) => {
    try {
        const newScooter =  new Scooter({
            status: req.body.status,
            model: req.body.model,
            station: req.body.station,
            position: req.body.position,
            log: req.body.log || []
        });

        const savedScooter = await newScooter.save();

        const response = apiResponse(true, savedScooter, 'Scooter added successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, error.message, 500);
        res.status(response.statusCode).json(response);
    }
});

app.delete('/scooter', async (req, res) => {
    try {
        // Delete all scooters and capture the result
        const result = await Scooter.deleteMany({});

        // result.deletedCount will have the count of documents deleted
        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'All scooters deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, 'Error deleting scooters', 500);
        res.status(response.statusCode).json(response);
    }
});

app.get('/scooter/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const scooter = await Scooter.findById(id);

        if (scooter) {
            const response = apiResponse(true, scooter, 'Scooter fetched successfully', 200);
            res.status(response.statusCode).json(response);
        } else {
            const response = apiResponse(false, null, 'Scooter not found', 404);
            res.status(response.statusCode).json(response);
        }
    } catch (error) {
        const response = apiResponse(false, null, error.message, 500);
        res.status(response.statusCode).json(response);
    }
});

app.put('/scooter/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const scooter = await Scooter.findById(id);

        const stationName = req.body.station.name;
        const stationCityName = req.body.station.city;
        const station = await Station.findOne({ name: stationName, 'city.name': stationCityName });

        if (scooter) {
            scooter.status = req.body.status !== undefined ? req.body.status : scooter.status;
            scooter.model = req.body.model !== undefined ? req.body.model : scooter.model;
            scooter.position = req.body.position !== undefined ? req.body.position : scooter.position;
            scooter.log = req.body.log !== undefined ? req.body.log : scooter.log;

            if (station) {
                scooter.station = {
                    name: station.name,
                    city: station.city.name,
                    id: station._id
                }
            } else {
                // Handle case where station is not found
                console.error(`Station not found: ${stationName}`);
                scooter.station = scooter.station;
                return;
            }

            const updatedScooter = await scooter.save();
            const response = apiResponse(true, updatedScooter, 'Scooter updated successfully', 200);
            res.status(response.statusCode).json(response);
        } else {
            const response = apiResponse(false, null, 'Scooter not found', 404);
            res.status(response.statusCode).json(response);
        }
    } catch (error) {
        const response = apiResponse(false, null, error.message, 500);
        res.status(response.statusCode).json(response);
    }
});

app.delete('/scooter/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Delete the scooter and capture the result
        const result = await Scooter.deleteOne({ _id: id });

        // result.deletedCount will have the count of documents deleted
        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'Scooter deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, 'Error deleting scooter', 500);
        res.status(response.statusCode).json(response);
    }
});

app.listen(port, () => console.log(`Elspackcyklar-app listening on port ${port}!`));
