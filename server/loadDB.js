// server/loadDB.js
const mongoose = require('mongoose');
const fs = require('fs');
const Scooter = require('./models/scooter.js');
const City = require('./models/city.js');
const Log = require('./models/log.js');
const Station = require('./models/station.js');
const User = require('./models/user.js');
const Rental = require('./models/rental.js');
const Status = require('./models/status.js');

// Function to read JSON file and load data into MongoDB
const loadCities = async () => {
    // Read the JSON file
    const data = JSON.parse(fs.readFileSync('../data/cities.json', 'utf8'));

    // Insert the data into the database
    result = await City.insertMany(data.cities);
};

const loadStations = async () => {
    // Read the JSON file
    const data = JSON.parse(fs.readFileSync('../data/stations.json', 'utf8'));

    const stations = data.stations;
    for (const station of stations) {
        const cityName = station.city.name;
        try {
            const city = await City.findOne({ name: cityName });
            if (city) {
                station.city.id = city._id;
            } else {
                // Handle case where city is not found
                console.error(`City not found: ${cityName}`);
                return;
            }
        } catch (error) {
            // Handle any other errors
            console.error(`Error finding city: ${cityName}`, error);
            return;
        }
    }

    // Insert the data into the database
    result = await Station.insertMany(data.stations);
};

const loadStatus = async () => {
    // Read the JSON file
    const data = JSON.parse(fs.readFileSync('../data/status.json', 'utf8'));

    // Insert the data into the database
    result = await Status.insertMany(data.status);
}

const loadLogs = async () => {
    // Read the JSON file
    const data = JSON.parse(fs.readFileSync('../data/logs.json', 'utf8'));

    const logs = data.logs;
    for (const log of logs) {
        const fromStationName = log.from_station.name;
        const fromStationCityName = log.from_station.city;
        const toStationName = log.to_station.name;
        const toStationCityName = log.to_station.city;

        try {
            const fromStation = await Station.findOne({ name: fromStationName, 'city.name': fromStationCityName });
            if (fromStation) {
                log.from_station.id = fromStation._id;
            } else {
                // Handle case where station is not found
                console.error(`Station not found: ${fromStationName}`);
                return;
            }
        } catch (error) {
            // Handle any other errors
            console.error(`Error finding station: ${fromStationName}`, error);
            return;
        } try {
            const toStation = await Station.findOne({ name: toStationName, 'city.name': toStationCityName });
            if (toStation) {
                log.to_station.id = toStation._id;
            } else {
                // Handle case where station is not found
                console.error(`Station not found: ${toStationName}`);
                return;
            }
        } catch (error) {
            // Handle any other errors
            console.error(`Error finding station: ${toStationName}`, error);
            return;
        }
    }

    // Insert the data into the database
    result = await Log.insertMany(data.logs);
};

const loadScooters = async () => {
        // Read the JSON file
        const data = JSON.parse(fs.readFileSync('../data/scooters.json', 'utf8'));

        const scooters = data.scooters;

        for (const scooter of scooters) {
            console.log(scooter.station);
            if (!scooter.station || Object.keys(scooter.station).length === 0) {
                scooter.station = {
                    name: null,
                    id: null,
                    city: null
                };
                continue;
            }
            const stationName = scooter.station.name;
            const stationCityName = scooter.station.city;

            try {
                const station = await Station.findOne({ name: stationName, 'city.name': stationCityName });
                if (station) {
                    scooter.station.id = station._id;
                }
            }
            catch (error) {
                console.error(`Error finding station: ${stationName}`, error);
                return;
            }
        }


        // Insert the data into the database
        result = await Scooter.insertMany(data.scooters);
};

const loadUsers = async () => {
        // Read the JSON file
        const data = JSON.parse(fs.readFileSync('../data/users.json', 'utf8'));

        // Insert the data into the database
        result = await User.insertMany(data.users);
}

const loadRentals = async () => {
        // Read the JSON file
        const data = JSON.parse(fs.readFileSync('../data/rentals.json', 'utf8'));

        const rentals = data.rentals;

        for (const rental of rentals) {
            const destinationStationName = rental.destination_station.name;
            const destinationStationCityName = rental.destination_station.city;
            const userFirstName = rental.user.first_name;
            const userLastName = rental.user.last_name;

            try {
                const destinationStation = await Station.findOne({ name: destinationStationName, 'city.name': destinationStationCityName });
                const user = await User.findOne({ first_name: userFirstName, last_name: userLastName });
                const scooter = await Scooter.findOne({ 'station.city': destinationStationCityName });

                if (destinationStation) {
                    rental.destination_station.id = destinationStation._id;
                }
                if (user) {
                    rental.user.id = user._id;
                }
                if (scooter) {
                    rental.scooter_id = scooter._id;
                }
            } catch (error) {
                console.error(`Error finding station: ${destinationStationName}`, error);
                return;
            }
        }
        // Insert the data into the database
        result = await Rental.insertMany(data.rentals);
}

const loadDB = async () => {
    try {
        await loadCities();
        console.log('Cities data successfully loaded!');

        await loadStations();
        console.log('Stations data successfully loaded!');

        await loadStatus();
        console.log('Status data successfully loaded!');

        await loadLogs();
        console.log('Logs data successfully loaded!');

        await loadScooters();
        console.log('Scooters data successfully loaded!');

        await loadUsers();
        console.log('Users data successfully loaded!');

        await loadRentals();
        console.log('Rentals data successfully loaded!');
    }catch (error) {
        console.error('Error loading data:', error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
};

mongoose.connect('mongodb://root:secret@localhost:27018/vteam', {
    authSource: 'admin'
}).then(async () => {
    console.log("Connected to database");

    // Drop the database
    try {
        await mongoose.connection.db.dropDatabase();
        console.log("Database dropped successfully");
    } catch (error) {
        console.error("Error dropping database", error);
        return;
    }

    // Load the data
    try {
        await loadDB();
    } catch (error) {
        console.error("Error loading data", error);
    } finally {
        mongoose.connection.close();
    }
}).catch(error => {
    console.error("Error connecting to database", error);
});
