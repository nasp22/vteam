// server/utils.js

const Station = require("./models/station");

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

module.exports = {
    apiResponse,
    findStation
};