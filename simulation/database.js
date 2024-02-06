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

        const updatedUsers = await collection.insertMany(args);

        await client.close();
    }
};

module.exports = database;
