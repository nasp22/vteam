// server/index.js
const { apiResponse } = require("./utils.js");
const Scooter = require('./models/scooter.js');
const City = require('./models/city.js');
const Log = require('./models/log.js');
const Station = require('./models/station.js');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const port= 1337;

mongoose.connect('mongodb://root:secret@vteam-database-1:27017/vteam', {
    authSource: 'admin'
});

app.use(express.json());

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/', (req, res) => {
    const routes = require('./routes/routes.json');
    const response = apiResponse(true, routes, 'Routes fetched successfully', 200);
    res.status(response.statusCode).json(response); // Set the status code and send the JSON response
});

app.get('/status', (req, res) => {
    const rows = require('./data/status.json');
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

        if (scooter) {
            scooter.status = req.body.status !== undefined ? req.body.status : scooter.status;
            scooter.model = req.body.model !== undefined ? req.body.model : scooter.model;
            scooter.station = req.body.station !== undefined ? req.body.station : scooter.station;
            scooter.position = req.body.position !== undefined ? req.body.position : scooter.position;
            scooter.log = req.body.log !== undefined ? req.body.log : scooter.log;

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

app.get('/log', async (req, res) => {
    const logs = await Log.find();
    const response = apiResponse(true, logs, 'Logs fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.post('/log', async (req, res) => {
    try {
        const newLog =  new Log({
            from_station: req.body.from_station,
            to_station: req.body.to_station,
            from_time: req.body.from_time,
            to_time: req.body.to_time
        });

        const savedLog = await newLog.save();

        const response = apiResponse(true, savedLog, 'Log added successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, error.message, 500);
        res.status(response.statusCode).json(response);
    }
});

// Route for dev and testing only
app.delete('/log', async (req, res) => {
    try {
        // Delete all logs and capture the result
        const result = await Log.deleteMany({});
        // result.deletedCount will have the count of documents deleted
        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'All logs deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, 'Error deleting logs', 500);
        res.status(response.statusCode).json(response);
    }
});

app.get('/log/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const log = await Log.findById(id);

        if (log) {
            const response = apiResponse(true, log, 'Log fetched successfully', 200);
            res.status(response.statusCode).json(response);
        }
        else {
            const response = apiResponse(false, null, 'Log not found', 404);
            res.status(response.statusCode).json(response);
        }
    } catch (error) {
        const response = apiResponse(false, null, error.message, 500);
        res.status(response.statusCode).json(response);
    }
});

app.put('/log/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const log = await Log.findById(id);

        if (log) {
            log.from_station = req.body.from_station !== undefined ? req.body.from_station : log.from_station;
            log.to_station = req.body.to_station !== undefined ? req.body.to_station : log.to_station;
            log.from_time = req.body.from_time !== undefined ? req.body.from_time : log.from_time;
            log.to_time = req.body.to_time !== undefined ? req.body.to_time : log.to_time;

            const updatedLog = await log.save();
            const response = apiResponse(true, updatedLog, 'Log updated successfully', 200);
            res.status(response.statusCode).json(response);
        } else {
            const response = apiResponse(false, null, 'Log not found', 404);
            res.status(response.statusCode).json(response);
        }
    } catch (error) {
        const response = apiResponse(false, null, error.message, 500);
        res.status(response.statusCode).json(response);
    }
});

app.delete('/log/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Log.deleteOne({ _id: id });
        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'Log deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, 'Error deleting log', 500);
        res.status(response.statusCode).json(response);
    }
});

app.get('/user', (req, res) => {
    // TODO: Fetch all users from the database
    const users = require('./data/users.json');
    const response = apiResponse(true, users, 'Users fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.post('/user', (req, res) => {
    // TODO: Add a new user to the database
    res.send('Adding a new user');
});

app.delete('/user', (req, res) => {
    // TODO: Delete all users from the database
    res.send('Deleting all users');
});

app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Fetch a specific user by ID from the database
    const data = require('./data/users.json');
    const user = data.users.find(user => user.id == id);
    const response = apiResponse(true, user, 'User fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.put('/user/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Update a specific user by ID
    res.send(`Updating user with ID ${id}`);
});

app.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Delete a specific user by ID
    res.send(`Deleting user with ID ${id}`);
});

app.get('/station', async (req, res) => {
    const stations = await Station.find();
    const response = apiResponse(true, stations, 'Stations fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.post('/station', async (req, res) => {
    try {
        const newStation =  new Station({
            name: req.body.name,
            scooter_quantity: req.body.scooter_quantity,
            position: req.body.position,
            city: req.body.city
        });

        // Check all required fields are present
        if (!newStation.name || !newStation.scooter_quantity || !newStation.position.lat || !newStation.position.lng || !newStation.city) {
            const response = apiResponse(false, newStation, 'Missing required fields', 400);
            res.status(response.statusCode).json(response);
            return;
        } else if (newStation.scooter_quantity < 0) {
            const response = apiResponse(false, newStation, 'Scooter quantity must be a positive number', 400);
            res.status(response.statusCode).json(response);
            return;
        }

        const savedStation = await newStation.save();

        const response = apiResponse(true, savedStation, 'Station added successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, error.message, 500);
        res.status(response.statusCode).json(response);
    }
});

// Route for dev and testing only
app.delete('/station', async (req, res) => {
    try {
        // Delete all stations and capture the result
        const result = await Station.deleteMany({});
        // result.deletedCount will have the count of documents deleted
        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'All stations deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, 'Error deleting stations', 500);
        res.status(response.statusCode).json(response);
    }
});

app.get('/station/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const station = await Station.findById(id);

        if (station) {
            const response = apiResponse(true, station, 'Station fetched successfully', 200);
            res.status(response.statusCode).json(response);
        } else {
            const response = apiResponse(false, null, 'Station not found', 404);
            res.status(response.statusCode).json(response);
        }
    } catch (error) {
        const response = apiResponse(false, null, error.message, 500);
        res.status(response.statusCode).json(response);
    }
});

app.put('/station/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const station = await Station.findById(id);

        if (station) {
            station.name = req.body.name !== undefined ? req.body.name : station.name;
            station.scooter_quantity = req.body.scooter_quantity !== undefined ? req.body.scooter_quantity : station.scooter_quantity;
            station.position = req.body.position !== undefined ? req.body.position : station.position;
            station.city = req.body.city !== undefined ? req.body.city : station.city;

            const updatedStation = await station.save();
            const response = apiResponse(true, updatedStation, 'Station updated successfully', 200);
            res.status(response.statusCode).json(response);
        } else {
            const response = apiResponse(false, null, 'Station not found', 404);
            res.status(response.statusCode).json(response);
        }
    } catch (error) {
        const response = apiResponse(false, null, error.message, 500);
        res.status(response.statusCode).json(response);
    }
});

app.delete('/station/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Station.deleteOne({ _id: id});

        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'Station deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, 'Error deleting station', 500);
        res.status(response.statusCode).json(response);
    }
});

app.get('/city', async (req, res) => {
    try {
        const cities = await City.find();
        const response = apiResponse(true, cities, 'Cities fetched successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, error.message, 500);
        res.status(response.statusCode).json(response);
    }
});

app.get('/city/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const city = await City.findById(id);
        const response = apiResponse(true, city, 'City fetched successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, error.message, 500);
        res.status(response.statusCode).json(response);
    }
});

//Route for dev and testing only
app.delete('/city', async (req, res) => {
    try {
        // Delete all cities and capture the result
        const result = await City.deleteMany({});

        // result.deletedCount will have the count of documents deleted
        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'All cities deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, 'Error deleting cities', 500);
        res.status(response.statusCode).json(response);
    }
});

app.get('/rent', (req, res) => {
    // TODO: Fetch all rents from the database
    res.send('Fetching all rents');
});

app.delete('/rent', (req, res) => {
    // TODO: Delete all rents from the database
    res.send('Deleting all rents');
});

app.post('/rent/:scooter_id/:user_id', (req, res) => {
    const scooter_id = req.params.scooter_id;
    const user_id = req.params.user_id;
    // TODO: Add a new rent to the database
    res.send(`Adding a new rent for scooter ${scooter_id} and user ${user_id}`);
});

app.get('/rent/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Fetch a specific rent by ID from the database
    res.send(`Fetching rent with ID ${id}`);
});

app.put('/rent/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Update a specific rent by ID
    res.send(`Updating rent with ID ${id}`);
});

app.delete('/rent/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Delete a specific rent by ID
    res.send(`Deleting rent with ID ${id}`);
});

app.listen(port, () => console.log(`Elspackcyklar-app listening on port ${port}!`));
