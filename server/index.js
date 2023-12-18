// server/index.js
const { apiResponse } = require("./utils.js");
const Scooter = require('./models/scooter.js');
const City = require('./models/city.js');
const Log = require('./models/log.js');
const Station = require('./models/station.js');
const Status = require('./models/status.js');
const User = require('./models/user.js');
const Rental = require('./models/rental.js');

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

app.get('/log', async (req, res) => {
    const logs = await Log.find();
    const response = apiResponse(true, logs, 'Logs fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.post('/log', async (req, res) => {
    try {
        const fromStationName = req.body.from_station.name;
        const fromStationCityName = req.body.from_station.city;
        const fromStation = await Station.findOne({ name: fromStationName, 'city.name': fromStationCityName });

        if (!fromStation) {
            const response = apiResponse(false, null, 'From station not found', 404);
            res.status(response.statusCode).json(response);
            return;
        }

        const toStationName = req.body.to_station.name;
        const toStationCityName = req.body.to_station.city;
        const toStation = await Station.findOne({ name: toStationName, 'city.name': toStationCityName });

        if (!toStation) {
            const response = apiResponse(false, null, 'To station not found', 404);
            res.status(response.statusCode).json(response);
            return;
        }

        const newLog =  new Log({
            from_station: {
                name: fromStation.name,
                city: fromStation.city.name,
                id: fromStation._id
            },
            to_station: {
                name: toStation.name,
                city: toStation.city.name,
                id: toStation._id
            },
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

app.get('/user', async (req, res) => {
    const users = await User.find();
    const response = apiResponse(true, users, 'Users fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.post('/user', async (req, res) => {
    try {
        const newUser =  new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            status: req.body.status,
            role: req.body.role,
            credit_amount: req.body.credit_amount,
            phone_number: req.body.phone_number,
            email: req.body.email,
            log: req.body.log || []
        });

        const savedUser = await newUser.save();

        const response = apiResponse(true, savedUser, 'User added successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, error.message, 500);
        res.status(response.statusCode).json(response);
    }
});

app.delete('/user', async (req, res) => {
    try {
        // Delete all users and capture the result
        const result = await User.deleteMany({});
        // result.deletedCount will have the count of documents deleted
        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'All users deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, 'Error deleting users', 500);
        res.status(response.statusCode).json(response);
    }
});

app.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    const response = apiResponse(true, user, 'User fetched successfully', 200);

    res.status(response.statusCode).json(response);
});

app.put('/user/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id);

        if (user) {
            user.first_name = req.body.first_name !== undefined ? req.body.first_name : user.first_name;
            user.last_name = req.body.last_name !== undefined ? req.body.last_name : user.last_name;
            user.status = req.body.status !== undefined ? req.body.status : user.status;
            user.role = req.body.role !== undefined ? req.body.role : user.role;
            user.credit_amount = req.body.credit_amount !== undefined ? req.body.credit_amount : user.credit_amount;
            user.phone_number = req.body.phone_number !== undefined ? req.body.phone_number : user.phone_number;
            user.email = req.body.email !== undefined ? req.body.email : user.email;
            if (req.body.log) {
                user.log.push(req.body.log);
            } else {
                user.log = user.log;
            }


            const updatedUser = await user.save();
            const response = apiResponse(true, updatedUser, 'User updated successfully', 200);
            res.status(response.statusCode).json(response);
        } else {
            const response = apiResponse(false, null, 'User not found', 404);
            res.status(response.statusCode).json(response);
        }
    } catch (error) {
        const response = apiResponse(false, null, error.message, 500);
        res.status(response.statusCode).json(response);
    }
});

app.delete('/user/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await User.deleteOne({ _id: id });

        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'User deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, 'Error deleting user', 500);
        res.status(response.statusCode).json(response);
    }
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
    console.log(id);

    try {
        let city = await City.findOne({ name: id });
        console.log(city);

        if (city === null) {
            city = await City.findById(id);
        } else if (city === null) {
            const response = apiResponse(false, null, 'City not found', 404);
            res.status(response.statusCode).json(response);
            return;
        }

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

app.get('/rent', async (req, res) => {
    const rents = await Rental.find();
    const response = apiResponse(true, rents, 'Rents fetched successfully', 200);
    res.status(response.statusCode).json(response);
});

app.delete('/rent', async (req, res) => {
    try {
        // Delete all rents and capture the result
        const result = await Rental.deleteMany({});

        // result.deletedCount will have the count of documents deleted
        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'All rents deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, 'Error deleting rents', 500);
        res.status(response.statusCode).json(response);
    }
});

app.post('/rent/:scooter_id/:user_id', async (req, res) => {
    const scooter_id = req.params.scooter_id;
    const user_id = req.params.user_id;
    const user = await User.findById(user_id);
    if (!user) {
        const response = apiResponse(false, null, 'User not found', 404);
        res.status(response.statusCode).json(response);
        return;
    }
    if (req.body.station.id) {
        const station = await Station.findById(req.body.station.id);
    } else if (req.body.station.name && req.body.station.city) {
        const station = await Station.findOne({ name: req.body.station.name, city: req.body.station.city });
    } else {
        const response = apiResponse(false, null, 'Station not found', 404);
        res.status(response.statusCode).json(response);
        return;
    }
    try {
        const newRental =  new Rental({
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                id: user_id
            },
            scooter_id: scooter_id,
            startfee: req.body.startfee,
            destination_station: {
                name: station.name,
                city: station.city,
                id: station._id
            },
            start_time: req.body.start_time,
            end_time: req.body.end_time
        });

        if (!newRental.user.id || !newRental.scooter_id || !newRental.startfee || !newRental.destination_station.id || !newRental.start_time || !newRental.end_time) {
            const response = apiResponse(false, newRental, 'Missing required fields', 400);
            res.status(response.statusCode).json(response);
            return;
        }

        const savedRental = await newRental.save();

        const response = apiResponse(true, savedRental, 'Rental added successfully', 200);
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, error.message, 400);
        res.status(response.statusCode).json(response);
    }
});

app.get('/rent/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const rent = await Rental.findById(id);

        if (rent) {
            const response = apiResponse(true, rent, 'Rent fetched successfully', 200);
            res.status(response.statusCode).json(response);
        } else {
            const response = apiResponse(false, null, 'Rent not found', 404);
            res.status(response.statusCode).json(response);
        }
    } catch (error) {
        const response = apiResponse(false, null, error.message, 400);
        res.status(response.statusCode).json(response);
    }
});

app.put('/rent/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const rent = await Rental.findById(id);

        if (rent) {
            rent.user = req.body.user !== undefined ? req.body.user : rent.user;
            rent.scooter_id = req.body.scooter_id !== undefined ? req.body.scooter_id : rent.scooter_id;
            rent.startfee = req.body.startfee !== undefined ? req.body.startfee : rent.startfee;
            rent.destination_station = req.body.destination_station !== undefined ? req.body.destination_station : rent.destination_station;
            rent.start_time = req.body.start_time !== undefined ? req.body.start_time : rent.start_time;
            rent.end_time = req.body.end_time !== undefined ? req.body.end_time : rent.end_time;

            const updatedRent = await rent.save();
            const response = apiResponse(true, updatedRent, 'Rent updated successfully', 200);
            res.status(response.statusCode).json(response);
        } else {
            const response = apiResponse(false, null, 'Rent not found', 404);
            res.status(response.statusCode).json(response);
        }
    } catch (error) {
        const response = apiResponse(false, null, error.message, 400);
        res.status(response.statusCode).json(response);
    }
});

app.delete('/rent/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = Rental.deleteOne({ _id: id });

        const response = apiResponse(true, { deletedCount: result.deletedCount }, 'Rent deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        const response = apiResponse(false, null, 'Error deleting rent', 500);
        res.status(response.statusCode).json(response);
    }
});

app.listen(port, () => console.log(`Elspackcyklar-app listening on port ${port}!`));
