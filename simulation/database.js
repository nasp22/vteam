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

        const updatedUsers = await collection.insertMany(args);

        await client.close();

        // Konvertera från MongoDB ID till string-representation
        const idHexStringArray = Object.values(updatedUsers.insertedIds).map(objectId => objectId.toHexString());

        return idHexStringArray;
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
