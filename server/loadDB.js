const mongoose = require('mongoose');
const fs = require('fs');
const Scooter = require('./models/scooter.js');
const City = require('./models/city.js');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27018/scooterdb');

// Function to read JSON file and load data into MongoDB
const loadScooters = async () => {
    try {
        // Read the JSON file
        const data = JSON.parse(fs.readFileSync('../data/scooters.json', 'utf8'));

        // Insert the data into the database
        await Scooter.insertMany(data.scooters);

        console.log('Scooters data successfully loaded!');
    } catch (error) {
        console.error('Error loading data:', error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
};

const loadCities = async () => {
    try {
        // Read the JSON file
        const data = JSON.parse(fs.readFileSync('../data/cities.json', 'utf8'));

        // Insert the data into the database
        await City.insertMany(data.city);

        console.log('Cities data successfully loaded!');
    } catch (error) {
        console.error('Error loading data:', error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}



// Call the function
// loadScooters();
loadCities();
