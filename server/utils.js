// server/utils.js

function apiResponse(success, data = null, message = null, statusCode = 200) 
{
    return {
        success,
        data,
        message,
        statusCode
    };
}

module.exports = {
    apiResponse
};