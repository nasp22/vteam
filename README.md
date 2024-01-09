# Repository for the project in course DV1676 - Programutveckling i virtuella team (Group 18)

## Scrutinizer:
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/nasp22/vteam/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/nasp22/vteam/?branch=main)

[![Code Coverage](https://scrutinizer-ci.com/g/nasp22/vteam/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/nasp22/vteam/?branch=main)

[![Build Status](https://scrutinizer-ci.com/g/nasp22/vteam/badges/build.png?b=main)](https://scrutinizer-ci.com/g/nasp22/vteam/build-status/main)

[![Code Intelligence Status](https://scrutinizer-ci.com/g/nasp22/vteam/badges/code-intelligence.svg?b=main)](https://scrutinizer-ci.com/code-intelligence)

# Set up server Back/Front-end
One command to start up backend server, (port:1337), and frontend server, (port:3000) and app (port:3001):
```
$ docker compose up -d database server client webbapp
```

# REST API Endpoints

The following endpoints are available in the API:

## Status
- `GET /status`: Fetches details about all statuses.

## Scooter
- `GET /scooter`: Retrieves details about all scooters.
- `POST /scooter`: Creates a new scooter.
- `DELETE /scooter`: Deletes all scooters.
- `GET /scooter/{id}`: Retrieves details of a specific scooter.
- `PUT /scooter/{id}`: Updates a specific scooter.
- `DELETE /scooter/{id}`: Deletes a specific scooter.

## Log
- `GET /log`: Fetches all logs.
- `POST /log`: Creates a new log.
- `GET /log/{id}`: Retrieves a specific log.
- `PUT /log/{id}`: Updates a specific log.
- `DELETE /log/{id}`: Deletes a specific log.

## User
- `GET /user`: Fetches all user details.
- `POST /user`: Creates a new user.
- `DELETE /user`: Deletes all users.
- `GET /user/{id}`: Retrieves a specific user's details.
- `PUT /user/{id}`: Updates a specific user's details.
- `DELETE /user/{id}`: Deletes a specific user.

## Station
- `GET /station`: Fetches details about all stations.
- `POST /station`: Creates a new station.
- `GET /station/{id}`: Retrieves details of a specific station.
- `PUT /station/{id}`: Updates a specific station.
- `DELETE /station/{id}`: Deletes a specific station.

## City
- `GET /city`: Fetches details about all cities.

## Rent
- `GET /rent`: Fetches details about all rentals.
- `DELETE /rent`: Deletes all rentals.
- `POST /rent/{scooter_id}/{user_id}`: Creates a rental for a specific scooter and user.
- `GET /rent/{rent_id}`: Retrieves details of a specific rental.
- `PUT /rent/{rent_id}`: Updates a specific rental.
- `DELETE /rent/{rent_id}`: Deletes a specific rental.

# auth_config.json
create a auth_config.json in client/src/auth_config.json with variables for auth0
as follow:
```
{
  "domain": "",
  "clientId": "",
  "audience": ""
}
```
