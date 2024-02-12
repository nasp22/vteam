
const fs = require('fs');


const { MongoClient, ObjectId } = require("mongodb");

const database = {
    accessDb: async function accessDb() {
        let dsn = "mongodb://root:secret@database:27017"

        const client = new MongoClient(dsn);

        return client;
    },

    createScooters: async function createScooters(args) {
        const client = await this.accessDb();

        await client.connect();

        const db = client.db("vteam"); // ?

        const collection = db.collection("scooters"); // ?

        const updatedScooters = await collection.insertMany(args);

        await client.close();
    },

    createUsers: async function createUsers(args) {
        const client = await this.accessDb();

        await client.connect();

        const db = client.db("vteam"); // ?

        const collection = db.collection("users"); // ?

        const updatedUsers = await collection.insertMany(args)


        // Insert admin
        const data = JSON.parse(fs.readFileSync('./server/data/users.json', 'utf8'));
        const response = await collection.insertMany(data.users);
        console.log(response)


        await client.close();
    },

    createCities: async function createCities() {

        const client = await this.accessDb();

        await client.connect();

        const db = client.db("vteam");

        const collection = db.collection("cities");

        // Insert cities
        const data = JSON.parse(fs.readFileSync('./server/data/cities.json', 'utf8'));
        response = await collection.insertMany(data.cities);
        console.log(response)

        await client.close();
    },

    createStations: async function createStations() {

        const client = await this.accessDb();

        await client.connect();

        const db = client.db("vteam");

        const collection = db.collection("stations");

        // Insert cities
        const data = JSON.parse(fs.readFileSync('./server/data/stations.json', 'utf8'));
        response = await collection.insertMany(data.stations);
        console.log(response)

        await client.close();
    }
};

module.exports = database;
