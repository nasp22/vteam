// server/__tests__/v1ScooterRoutesTest.js

const request = require('supertest');
const server = require('../server.js');
const Scooter = require('../models/scooter.js');
const Station = require('../models/station.js');
const mongoose = require('mongoose');

jest.mock('mongoose', () => {
    const actualMongoose = jest.requireActual('mongoose');
    return {
        ...actualMongoose,
        connect: jest.fn().mockResolvedValue(null),
        connection: {
            close: jest.fn().mockResolvedValue(null)
        }
    };
});

// Mock the database models
jest.mock('../models/station.js', () => {
    return {
        find: jest.fn(),
        findById: jest.fn().mockImplementation((id) => {
            return Promise.resolve({
                _id: id,
                name: 'Test Station',
                city: 'Test City',
                position: {
                    lat: 12.34,
                    lng: 56.78
                },
                scooters: []
            });
        }),
    };
});
jest.mock('../models/scooter.js', () => {
    return {
        find: jest.fn(),
        findById: jest.fn().mockImplementation((id) => {
            return Promise.resolve({
                _id: id,
                status: 1,
                model: 'Test Model',
                city: 'Test City',
                station: {
                    name: 'Test Station',
                    id: '123',
                    city: 'Test City'
                },
                position: {
                    lat: 12.34,
                    lng: 56.78
                },
                log: []
            });
        }),
    };
});


describe('v1ScooterRoutesTest', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        Scooter.find.mockClear();
        Scooter.findById.mockClear();
    });

    afterAll(async () => {
        // Close the database connection
        await new Promise(resolve => server.close(resolve));
        await mongoose.connection.close();
    }, 15000); // 15 seconds

    describe('GET /scooter', () => {
        test('should return 200 OK', async () => {
            Scooter.find.mockResolvedValueOnce([]);
            const response = await request(server).get('/scooter');
            expect(response.statusCode).toEqual(200);
        });

        test('should return 500 Internal Server Error', async () => {
            Scooter.find.mockRejectedValueOnce(new Error('Internal Server Error'));
            const response = await request(server).get('/scooter');
            expect(response.statusCode).toEqual(500);
        });
    });

    // describe('post /scooter', () => {
    //     test('should return 200 OK', async () => {
    //         const scooterData = {
    //             status: 1,
    //             model: 'Test Model',
    //             city: 'Test City',
    //             // Include other required fields if any
    //         };
    //         const response = await request(server).post('/scooter').send(scooterData);
    //         expect(response.statusCode).toEqual(200);
    //     });

    //     test('should return 400 Bad Request', async () => {
    //         const response = await request(server).post('/scooter');
    //         expect(response.statusCode).toEqual(400);
    //     });
    // });
});
