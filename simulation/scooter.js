const helper = require('./helper');
// const scootersJSON = require('./scooters.json')

class Scooter {
    constructor({_id, status, model, city, station, position, log, battery = 100, speed_in_kmh = 0}) {
        // Part of DB
        this._id = _id;
        this.status = status;
        this.model = model;
        this.city = city;
        this.station = station;
        this.position = position;
        this.log = log;

        this.battery = battery;
        this.speed_in_kmh = speed_in_kmh;
    }

    // async initializeScooter() {
    //     const newScooter = {
    //         status: this.status,
    //         model: this.model,
    //         city: "Stockholm", //TEST
    //         station: {
    //             id: "test",
    //             name: "test",
    //             city: "test"
    //             // id: null,
    //             // name: null,
    //             // city: null
    //         },
    //         position: {
    //             lat: this.position.lat,
    //             lng: this.position.lng,
    //         },
    //         log: []
    //     };

    //     // If Scooter is not created in DB yet
    //     if (this._id === 1) {
    //         // Create scooter
    //         const response = await fetch("http://server:1337/scooter", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(newScooter)
    //         });
    //         // const response = await fetch("http://server:1337/scooter"); // Test GET
    //         const result = await response.json();
    //         console.log(result);
    //     }
    // }

    updateDB() {
        // uppdatera info om scootern
        console.log({
            ID: this._id, Status: this.status, Model: this.model, Station: this.station, Position: this.position, Log: this.log
        });
        console.log({Battery_percentage: this.battery});
    }

    sendUpdate() {
        // Ladda/förbruka batteri, om batteri
        this.updateBattery();
        // if (this.battery !== 0) {
            //     this.updateBattery();
            // }
            
            // if (this.battery > 0)
            // // Anropa DB och uppdatera info om scootern?
            // this.updateDB();

        // console.log("DOING UPDATE")
        this.moveScooter();
    }

    propertiesToObject() {
        return {
            _id: this._id,
            status: this.status,
            model: this.model,
            station: this.station,
            position: this.position,
            log: this.log
        };
    }

    updateBattery() {
        // Set number of seconds for each loop, used for
        const loopTimer = 5;

        // Om status är "Error", "Service"
        // if (this.status in [1004, 1005]) {
        //     if (this.isOnStation()) {
        //         // test
        //         this.status = 1003;
        //     }

        //     return;
        // }

        // if (this.status in [1004, 1005]) {
        if (this.status === 1004 || this.status === 1005) {
            if (!this.isOnStation()) {
                // test
                return;
            }

            this.status = 1003;
        }

        // Om status är "Ready"
        if (this.status === 1001) {
            // this.battery -= 1;
            
        }

        // Om status är "Rented"
        else if (this.status === 1002) {
            this.battery -= 2;

            // Save coordinates
            const initialCoords = this.position;

            // Simulate movement and save new coordinate
            this.position = helper.moveScooter();

            // Calculate scooter speed based on distance between coordinates
            this.speed_in_kmh = helper.calculateSpeed(initialCoords, this.position);
        }

        // Om status är "Loading"
        else if (this.status === 1003) {
            this.battery += 3;

            // Korrigera batteri till 100 och sätt status till "Ready"
            if (this.battery >= 100) {
                this.battery = 100;
                this.status = 1001;
            }
        }

        // Om batteriet är tomt
        if (this.battery <= 0) {
            if (this.status === 1002) {
                this.endRent();
            }

            this.status = 1004;

            // Korrigera batteriet till 0 (inte negativ)
            this.battery = 0;

            // Uppdatera en sista gång innan batteriet dör helt
            this.updateDB();
        }
    }

    isOnStation() {
        // return true; // TEST for testing purposes
        // return false; // TEST for testing purposes
        return this.station != [];
    }

    startRent() {
        this.status = 1002;

        // this.startTime = new Date();
        // const timeDate = new Date();
        // const date = timeDate.toLocaleString("en-GB", { timeZone: "Europe/Stockholm", timeStyle: "long"})
        // this.startTime = timeDate.toLocaleString("en-GB", { timeZone: "Europe/Stockholm", timeStyle: "medium"})
        // console.log(currentTime)
        // this.startTime = timeDate
        this.startTime = Date.now();
        console.log(this.startTime);
    }

    endRent() {
        this.status = 1001; // stämmer det ens?
        this.speed_in_kmh = 0; // behövs det ens?
        this.endTime = Date.now();
        this.createLog();
    }

    createLog() {
        const information = {
            start: this.startTime,
            end: this.endTime
        };
        console.log(information);
        // anropa API för att skapa log
    }

    moveScooter() {
        // console.log("Flytta lat och lng lite");
    }

    // turnOff() {
    //     this.turnedOn = false // Om variabeln ska användas
    // }
}

module.exports = Scooter;
