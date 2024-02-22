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

        const db = client.db("vteam");

        const collection = db.collection("scooters");

        await collection.insertMany(args);

        await client.close();
    },

    createUsers: async function createUsers(args) {
        const client = await this.accessDb();

        await client.connect();

        const db = client.db("vteam");

        const collection = db.collection("users");

        // Lägg till simulerade användare
        const createdUsers = await collection.insertMany(args);
        
        // Insert admin
        const data = JSON.parse(fs.readFileSync('./server/data/users.json', 'utf8'));
        const response = await collection.insertMany(data.users);
        console.log(response);
        
        await client.close();

        // Konvertera från MongoDB ID till string-representation
        const idHexStringArray = Object.values(createdUsers.insertedIds).map(objectId => objectId.toHexString());

        return idHexStringArray;
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

        // Insert stations
        const data = JSON.parse(fs.readFileSync('./server/data/stations.json', 'utf8'));
        response = await collection.insertMany(data.stations);
        console.log(response)

        await client.close();
    },

    createStatus: async function createStatus() {

        const client = await this.accessDb();

        await client.connect();

        const db = client.db("vteam");

        const collection = db.collection("status");

        // Insert status
        const data = JSON.parse(fs.readFileSync('./server/data/status.json', 'utf8'));
        response = await collection.insertMany(data.status);
        console.log(response)

        await client.close();
    },

    updateScooters: async function updateScooters(args) {
        const client = await this.accessDb();

        await client.connect();

        const db = client.db("vteam");

        const collection = db.collection("scooters");

        const bulkOperations = [];

        for (const id in args) {
            const data = args[id];
            const _id = new ObjectId(data._id);

            delete data._id
            bulkOperations.push({
                updateOne: {
                    filter: { _id: _id },
                    update: { $set: data }
                }
            });
        }

        try {
            const result = await collection.bulkWrite(bulkOperations);

            console.log(`${result.modifiedCount} documents updated successfully!`);
        } catch(err) {
            console.error("Error updating documents:", err);
        }

        await client.close();
    }
};

module.exports = database;
