// server/__tests__/v1CityRoutesTest.js

const request = require('supertest');
const server = require('../server.js');
const Log = require('../models/log.js');
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

// Mock the log model
jest.mock('../models/log.js');

describe('v1LogRoutesTest', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        Log.find.mockClear();
    });

    afterAll(async () => {
        // Close the database connection
        await new Promise(resolve => server.close(resolve));
        await mongoose.connection.close();
    }, 15000); // 15 seconds

    describe('GET /log', () => {
        it ('should return all logs', async () => {
            Log.find.mockResolvedValue([
                { 
                    start_position: { lat: 59.329323, lng: 18.068581 },
                    end_position: { lat: 59.329323, lng: 18.068581 },
                    from_time: '2021-04-01T12:00:00.000Z',
                    to_time: '2021-04-01T12:00:00.000Z' 
                }
            ]);

            const res = await request(server).get('/log');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.data.length).toEqual(1);
        });
    });

    describe('POST /log', () => {
        it ('should return a 400 response', async () => {
            const res = await request(server).post('/log');
            expect(res.statusCode).toEqual(400);
        });
        it ('should return a 200 response', async () => {
            const res = await request(server).post('/log')
                .send({
                    start_position: { lat: 59.329323, lng: 18.068581 },
                    end_position: { lat: 59.329323, lng: 18.068581 },
                    from_time: '2021-04-01T12:00:00.000Z',
                    to_time: '2021-04-01T12:00:00.000Z'
                });
            expect(res.statusCode).toEqual(200);
        });
    });
});

