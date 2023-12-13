// server/index.js
const { apiResponse } = require("./utils.js");
const express = require('express');
const app = express();

const port= 1337;

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
    const rows = require('../data/status.json');
    const response = apiResponse(true, rows, 'Status fetched successfully', 200);
    res.status(response.statusCode).json(response); // Set the status code and send the JSON response
});


app.get('/scooter', (req, res) => {
    // TODO: Change to fetch all scooters from the database
    const scooters = require('../data/scooters.json');
    const response = apiResponse(true, scooters, 'Scooters fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.post('/scooter', (req, res) => {
    // TODO: Add data to database
    res.send('Adding a new scooter');
});

app.delete('/scooter', (req, res) => {
    // TODO: Delete data from database
    res.send('Deleting all scooters');
});

app.get('/scooter/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Change to fetch a specific scooter by ID from the database
    const data = require('../data/scooters.json');
    const scooter = data.scooters.find(scooter => scooter.id == id);
    const response = apiResponse(true, scooter, 'Scooter fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.put('/scooter/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Update data in database
    res.send('Updating scooter with ID ${id}');
});

app.delete('/scooter/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Delete data from database
    res.send('Deleting scooter with ID ${id}');
});

app.get('/log', (req, res) => {
    // TODO: Fetch all logs from the database
    const logs = require('../data/logs.json');
    const response = apiResponse(true, logs, 'Logs fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.post('/log', (req, res) => {
    // TODO: Add a new log to the database
    res.send('Adding a new log');
});

app.get('/log/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Fetch a specific log by ID from the database
    const data = require('../data/logs.json');
    const log = data.logs.find(log => log.id == id);
    const response = apiResponse(true, log, 'Log fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.put('/log/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Update a specific log by ID
    res.send(`Updating log with ID ${id}`);
});

app.delete('/log/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Delete a specific log by ID
    res.send(`Deleting log with ID ${id}`);
});

app.get('/user', (req, res) => {
    // TODO: Fetch all users from the database
    const users = require('../data/users.json');
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
    const data = require('../data/users.json');
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

app.get('/station', (req, res) => {
    // TODO: Fetch all stations from the database
    const stations = require('../data/stations.json');
    const response = apiResponse(true, stations, 'Stations fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.post('/station', (req, res) => {
    // TODO: Add a new station to the database
    res.send('Adding a new station');
});

app.get('/station/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Fetch a specific station by ID from the database
    const data = require('../data/stations.json');
    const station = data.stations.find(station => station.id == id);
    const response = apiResponse(true, station, 'Station fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.put('/station/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Update a specific station by ID
    res.send(`Updating station with ID ${id}`);
});

app.delete('/station/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Delete a specific station by ID
    res.send(`Deleting station with ID ${id}`);
});

app.get('/city', (req, res) => {
    // TODO: Chagne to fetch all cities from the database
    const cities = require('../data/cities.json');
    const response = apiResponse(true, cities, 'Cities fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.get('/city/:id', (req, res) => {
    const id = req.params.id;
    // TODO: Change to fetch a specific city by ID from the database
    const data = require('../data/cities.json');
    const city = data.cities.find(city => city.id == id);
    const response = apiResponse(true, city, 'City fetched successfully', 200);
    res.status(response.statusCode).json(response);
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
