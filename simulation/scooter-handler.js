const Scooter = require("./scooter");
const helper = require("./helper");
const database = require("./database");

class ScooterHandler {
    constructor(scooterCount = 1000, customerCount = 1000) {
        // skapa simulation med scooterCount och customerCount, starta simulation?
        this.scooterCount = scooterCount;
        this.customerCount = customerCount;

        this.scooters = {};
        this.updateTimer = 5000

        this.getAllScooters();
    }

    async getAllScooters() {
        try {
            const response = await fetch("http://server:1337/scooter");

            if (response.ok) {
                const result = await response.json();
                const scooters = result.data;
                // console.log(scooters);

                // Create scooters from database
                this.createScooters(scooters);

                // Start simulation
                this.startSimulation();

                // Continuous refresh loop
                setInterval(() => this.refreshScooterData(), this.updateTimer);
            }
        } catch (error) {
            setTimeout(() => this.getAllScooters(), 5000)
        }
    }

    createScooters(data) {
        // Skapa Scooter-objekt av datan som hämtas från API
        for (const scooter of data) {
            const newScooter = new Scooter({
                _id: scooter._id,
                status: scooter.status,
                model: scooter.model,
                city: scooter.city,
                station: scooter.station,
                position: scooter.position,
                log: scooter.log,
                battery: scooter.battery || 100,
                speed_in_kmh: scooter.speed_in_kmh || 0
            });

            this.scooters[scooter._id] = newScooter;
        }
    }

    async refreshScooterData() {
        const response = await fetch("http://server:1337/scooter");
        const result = await response.json();
        const updatedData = result.data;

        for (const scooter of updatedData) {
            // Se ifall ändringar gjorts via frontend/appen
            if (scooter._id in this.scooters) {
                // console.log("Match found");
                const existingScooter = this.scooters[scooter._id];

                existingScooter._id = scooter._id;
                existingScooter.status = scooter.status;
                existingScooter.model = scooter.model;
                existingScooter.city = scooter.city;
                existingScooter.station = scooter.station;
                existingScooter.position = scooter.position;
                existingScooter.log = scooter.log;
                existingScooter.battery = scooter.battery || 100;
                existingScooter.speed_in_kmh = scooter.speed_in_kmh || 0;
            } else {
                // console.log(scooter._id);
                const newScooter = new Scooter({
                    _id: scooter._id,
                    status: scooter.status,
                    model: scooter.model,
                    city: scooter.city,
                    station: scooter.station,
                    position: scooter.position,
                    log: scooter.log,
                    battery: scooter.battery || 100,
                    speed_in_kmh: scooter.speed_in_kmh || 0
                });

                this.scooters[scooter._id] = newScooter;
            }
        }

        // Simulera scooterns nästa händelse
        this.simulateScooters();
    }

    simulateScooters() {
        // console.log(this.scooters);
        for (const scooter in this.scooters) {
            // console.log("Simulerar scooter")
            // console.log("this.scooters[scooter]", this.scooters[scooter]);
            this.scooters[scooter].sendUpdate();
            // scooter.sendUpdate();
        }
    }

    async startSimulation() {
        // Create scooters
        const scooters = [];

        for (let i = 0; i < this.scooterCount; i++) {
            const randomCity = helper.getRandomCity();
            const scooterProperties = {
                status: helper.getRandomStatus(),
                model: "Model X",
                city: randomCity,
                station: {
                    name: null,
                    id: null,
                    city: null,
                },
                position: helper.getRandomPosition(randomCity),
                log: [],
                battery: 100,
                speed: 0
            };

            // Option 1: Add scooter info to array, then insert all in database,
            //      won't create Scooter-objects until next update loop
            scooters.push(scooterProperties);

            // Option 2: Create Scooter-objects directly and add them to object of Scooters,
            //      and insert their info to database
            // this.scooters[scooterProperties._id] = new Scooter(scooterProperties);
            // scooters.push(scooterProperties);
        }

        // Add scooters to database
        await database.createScooters(scooters);

        // Create customers
        const customers = [];

        for (let i = 0; i < this.customerCount; i++) {

            const customerProperties = {
                first_name: helper.getRandomFirstName(),
                last_name: helper.getRandomLastName(),
                status: "Active", // ?
                role: "ppu", // ppu eller ppm?
                credit_amount: helper.getRandomInt(100, 1000),
                // next_payment_date: "Date", // ?
                phone_number: "070-" + (1000000 + i),
            };

            customerProperties["email"] = `${customerProperties.first_name}.${customerProperties.last_name}${helper.getRandomInt(0, 100)}@vmail.com`;

            customers.push(customerProperties);
        }

        //Create Users
        await database.createUsers(customers);

        //Create Cities
        await database.createCities();

        //Create Stations
        await database.createStations();
    }
}

function runScooterHandler() {
    const scooterHandler = new ScooterHandler(500, 500);
}

// async function loadDB() {
//     try {
//         const response = await fetch("http://server:1337/user");

//         if (response.ok) {
//             const result = await response.json();
//             const users = result.data;
//             console.log(users.length)
//             if (users.length === 0) {
//                 require("./loadDB");
//                 runScooterHandler();
//             }
//         }
//     } catch (error) {
//         console.error(error);
//         setTimeout(() => loadDB(), 5000)
//     }
// }

// loadDB();

runScooterHandler();

// async function main() {
//     await loadDB();

//     // runScooterHandler();
// }

// main();