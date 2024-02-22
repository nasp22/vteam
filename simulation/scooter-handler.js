const Scooter = require("./scooter");
const helper = require("./helper");
const database = require("./database");

class ScooterHandler {
    constructor(scooterCount = 1000, customerCount = 1000) {
        // Skapa simulation med scooterCount scootrar och customerCount användare/kunder
        this.scooterCount = scooterCount;
        this.customerCount = customerCount;

        // Objekt för att lagra scootrar (av class Scooter) där varje key är scooterns _id
        this.scooters = {};

        // Hur ofta programmet hämtar scootrar från databasen, simulerar användare och scootrar, osv
        this.updateTimer = 5000

        this.getAllScooters();
    }

    async getAllScooters() {
        try {
            const response = await fetch("http://server:1337/scooter");

            if (response.ok) {
                const result = await response.json();
                const scooters = result.data;

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
        try {
            const response = await fetch("http://server:1337/scooter");
            const result = await response.json();
            const updatedData = result.data;

            for (const scooter of updatedData) {
                // Se ifall ändringar gjorts via frontend/appen
                if (scooter._id in this.scooters) {
                    // Uppdatera existerande scooters information
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
                    // Skapa ny instans av Scooter
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

            // Simulera att scooter blir uthyrd
            await this.simulateCustomers();

            // Simulera scooterns nästa händelse
            await this.simulateScooters();
        } catch (error) {
            console.error(error);
            console.log("Skipping fetch.")
        }

    }

    // simulateScooters() {
    async simulateScooters() {
        for (const scooter in this.scooters) {
            // Simulera varje scooters beteende
            this.scooters[scooter].sendUpdate();
        }

        // Gör om från Scooter-instanser till object med deras properties
        const transformedObject = {};

        Object.keys(this.scooters).forEach(_id => {
            const scooter = this.scooters[_id];
            const scooterProperties = scooter.propertiesToObject();
            transformedObject[_id] = scooterProperties;
        });

        // Använd den transformerade datan för att uppdatera scootrarna i databasen
        await database.updateScooters(transformedObject);
    }

    async simulateCustomers() {
        // Loopa igenom (alla/lediga/upptagna?) kunder
        for (const user in this.customers) {
            const customerID = this.customers[user];
            if (Object.keys(this.rentingUsers).includes(customerID)) {
                // Användaren hyr redan, gå vidare till nästa
                continue;
            }

            const chanceToRent = 0.05;
            const randomNumber = helper.getRandomFloat(0, 1);

            // Random chans att en kund startar uthyrning
            // Loopa igenom scootrar och titta efter status "Ledig"
            if (chanceToRent >= randomNumber) {
                // Påbörja uthyrning ifall scooter finns tillgänglig
                for (const scooter in this.scooters) {
                    // Påbörja uthyrning ifall scooter finns tillgänglig (status = Ready)
                    if (this.scooters[scooter].status === 1001) {
                        const rentData = await helper.createRent(scooter, customerID);

                        // Om uthyrningen misslyckades
                        if (rentData.statusCode !== 201) {
                            // Skippa uthyrning till nästa update
                            break;
                        }

                        this.scooters[scooter].startRent();

                        // Spara rent i ett objekt
                        this.rentingUsers[customerID] = {
                            rentID: rentData.data._id,
                            scooterID: scooter,
                            updatesLeft: helper.getRandomInt(10, 100)
                        };

                        break;
                    }
                }
            }
        }

        // Sänk antal updates innan rent avbryts
        for (const user in this.rentingUsers) {
            this.rentingUsers[user].updatesLeft -= 1;

            if (this.rentingUsers[user].updatesLeft <= 0) {
                // Avbryt uthyrning
                await helper.endRent(this.rentingUsers[user].rentID);

                this.scooters[this.rentingUsers[user].scooterID].endRent();

                // Radera uthyrningens information
                delete this.rentingUsers[user];
            }
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
                speed_in_kmh: 0
            };

            scooters.push(scooterProperties);
        }

        // Add scooters to database
        await database.createScooters(scooters);

        // Create customers
        this.rentingUsers = {};

        const customers = [];

        for (let i = 0; i < this.customerCount; i++) {

            const customerProperties = {
                first_name: helper.getRandomFirstName(),
                last_name: helper.getRandomLastName(),
                status: "Active",
                role: "ppu",
                credit_amount: helper.getRandomInt(100, 1000),
                phone_number: "070-" + (1000000 + i),
            };

            customerProperties["email"] = `${customerProperties.first_name}.${customerProperties.last_name}${helper.getRandomInt(0, 100)}@vmail.com`;

            customers.push(customerProperties);
        }

        // Create Users
        const createdCustomers = await database.createUsers(customers);

        this.customers = createdCustomers;

        // Create Cities
        await database.createCities();

        // Create Stations
        await database.createStations();

        // Create Status
        await database.createStatus();
    }
}

function runScooterHandler() {
    const scooterHandler = new ScooterHandler(1000, 1000);
}

runScooterHandler();
