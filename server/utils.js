// server/utils.js

const Station = require("./models/station.js");
const Scooter = require("./models/scooter.js");

function apiResponse(success, data = null, message = null, statusCode = 200) 
{
    return {
        success,
        data,
        message,
        statusCode
    };
}

async function findStation(stationName, stationCityName) {
    return await Station.findOne({ name: stationName, 'city.name': stationCityName });
}

async function findScooter(scooterId) {
    return await Scooter.findById(scooterId);
}

module.exports = {
    apiResponse,
    findStation,
    findScooter
};