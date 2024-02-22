const helper = require('./helper');

class Scooter {
    constructor({_id, status, model, city, station, position, log, battery = 100, speed_in_kmh = 0}) {
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

    sendUpdate() {
        // Simulera laddning/förbrukning av batteri, beroende på status
        this.updateBattery();
    }

    propertiesToObject() {
        return {
            _id: this._id,
            status: this.status,
            model: this.model,
            city: this.city,
            station: this.station,
            position: this.position,
            log: this.log,
            battery: parseFloat(this.battery.toFixed(2)),
            speed_in_kmh: this.speed_in_kmh
        };
    }

    updateBattery() {
        // Om status är Error eller Service
        if (this.status === 1004 || this.status === 1005) {
            if (!this.isOnStation()) {
                // Skippa ladda om scooter inte är vid en station
                return;
            }

            this.status = 1003;
        }

        // Om status är "Rented"
        if (this.status === 1002) {
            this.battery -= 2 / 50;

            // Save coordinates
            const initialCoords = this.position;

            // Simulate movement and save new coordinate
            this.position = helper.moveScooter(this.position);

            // Calculate scooter speed based on distance between coordinates
            this.speed_in_kmh = helper.calculateSpeed(initialCoords, this.position);
        }

        // Om status är "Loading"
        else if (this.status === 1003) {
            this.battery += 3 / 50;

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
        }
    }

    isOnStation() {
        return this.station != [];
    }

    startRent() {
        this.status = 1002;

        this.startTime = Date.now();
        this.startPosition = this.position;
    }

    endRent() {
        this.status = 1001;
        this.speed_in_kmh = 0;
        this.endTime = Date.now();
        this.endPosition = this.position;
        this.createLog();
    }

    createLog() {
        const information = {
            start_position: this.startPosition,
            end_position: this.endPosition,
            from_time: this.startTime,
            to_time: this.endTime
        };

        this.log.push(information);
    }
}

module.exports = Scooter;
