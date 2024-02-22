const names = require("./names.json");

const helper = {
    getRandomInt: function getRandomInt(min, max, inclusive=true) {
        if (inclusive) {
            // min=0 and max=1 always gives 0 or 1
            return Math.floor(Math.random() * (max + 1 - min) + min);
        }

        // min=0 and max=1 always gives 0
        return Math.floor(Math.random() * (max - min) + min);
      },

    getRandomFloat: function getRandomFloat(min, max, decimals=1) {
        const number = Math.random() * (max - min) + min;
        return parseFloat(number.toFixed(decimals))
    },

    getRandomStatus: function getRandomStatus() {
        const randomNumber = this.getRandomInt(1, 100);

        if (randomNumber <= 80) {
            return 1001;
        } else if (randomNumber <= 90) {
            return 1004;
        }
        return 1005;
    },

    getRandomCity: function getRandomCity() {
        const cities = ["Stockholm", "Malmö", "Göteborg"];
        const randomIndex = this.getRandomInt(0, 2)

        return cities[randomIndex];
    },

    getRandomPosition: function getRandomPosition(city) {
        if (!["Stockholm", "Malmö", "Göteborg"].includes(city)) {
            throw new Error("Invalid city!");
        }

        // About 700 meters
        const deviationFromCenter = 0.0062500;

        const cityPositions = {
            Stockholm: [{
                name: "Norrmalm",
                lat: 59.3348344, 
                lng: 18.0634861
            }],
            Malmö: [{
                name: "Lilla Torget",
                lat: 55.605531, 
                lng: 13.001417
            }],
            Göteborg: [{
                name: "Centralstation",
                lat: 57.708580, 
                lng: 11.973250
            }]
        };

        const randomLocationIndex = 0;
        const position = {
            lat: this.getRandomFloat(
                cityPositions[city][randomLocationIndex].lat - deviationFromCenter,
                cityPositions[city][randomLocationIndex].lat + deviationFromCenter,
                7
            ),
            lng: this.getRandomFloat(
                cityPositions[city][randomLocationIndex].lng - deviationFromCenter,
                cityPositions[city][randomLocationIndex].lng + deviationFromCenter,
                7
            )
        };

        return position
    },

    getRandomFirstName: function getRandomFirstName() {
        const firstNames = names.first_names
        const randomIndex = this.getRandomInt(0, firstNames.length, false);

        return firstNames[randomIndex];
    },

    getRandomLastName: function getRandomLastName() {
        const lastNames = names.last_names
        const randomIndex = this.getRandomInt(0, lastNames.length, false);

        return lastNames[randomIndex];
    },

    calculateSpeed: function calculateSpeed(coordinate1, coordinate2, updateTime=5000) {
        const haversine = require("haversine-distance");
        const distance = haversine(coordinate1, coordinate2);
        const speedMS = distance / (updateTime / 1000);
        const speedKMH = speedMS * 3.6;
        return speedKMH.toFixed(1);
    },

    moveScooter: function moveScooter(coordinate) {
        const latIncrement = this.getRandomFloat(0.00010, 0.00015, decimals=5);
        const lngIncrement = this.getRandomFloat(0.00010, 0.00015, decimals=5);
        const randomIndex = this.getRandomInt(0, 7);

        const possibleCoordinates = [
            {
                lat: latIncrement,
                lng: 0
            },
            {
                lat: latIncrement,
                lng: lngIncrement
            },
            {
                lat: 0,
                lng: lngIncrement
            },
            {
                lat: -latIncrement,
                lng: 0
            },
            {
                lat: -latIncrement,
                lng: -lngIncrement
            },
            {
                lat: 0,
                lng: -lngIncrement
            },
            {
                lat: latIncrement,
                lng: -lngIncrement
            },
            {
                lat: -latIncrement,
                lng: lngIncrement
            }
        ];
        const newCoordinate = {
            lat: coordinate.lat + possibleCoordinates[randomIndex].lat,
            lng: coordinate.lng + possibleCoordinates[randomIndex].lng
        };

        return newCoordinate;
    },

    createRent: async function createRent(scooterID, userID) {
        const response = await fetch(`http://server:1337/rent/${scooterID}/${userID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"startfee": 5})
        });
        const result = await response.json();

        return result;
    },

    endRent: async function endRent(rentID) {
        const response = await fetch (`http://server:1337/rent/${rentID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"end_time": Date.now()})
        });
        const result = await response.json();

        return result;
    }
};

module.exports = helper;