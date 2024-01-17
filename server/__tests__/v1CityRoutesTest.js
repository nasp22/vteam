// server/tests/v1CityRoutesTest.js

const request = require('supertest');
// const app = require('../index.js');
const server = require('../server.js');
const City = require('../models/city.js');
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

// Mock the city model
jest.mock('../models/city.js');

describe('v1CityRoutesTest', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        City.find.mockClear();
    });

    afterAll(async () => {
        // Close the database connection
        await new Promise(resolve => server.close(resolve));
        await mongoose.connection.close();
    }, 15000); // 15 seconds

    describe('GET /city', () => {
        it ('should return all cities', async () => {
            City.find.mockResolvedValue([
                    { name: 'Stockholm', position: { lat: 59.329323, lng: 18.068581 } },
                    { name: 'Göteborg', position: { lat: 57.70887, lng: 11.97456 } },
                    { name: 'Malmö', position: { lat: 55.60587, lng: 13.00073 } }
                ]);

            const res = await request(server).get('/city');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.data.length).toEqual(3);
        }, 15000); // 15 seconds
        it ('should return a 404 response', async () => {
            City.find.mockResolvedValue(null);

            const res = await request(server).get('/city');
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('GET /city/:id', () => {
        it ('should return a 404 response', async () => {
            City.findById.mockResolvedValue({
                name: 'Stockholm',
                position: { lat: 59.329323, lng: 18.068581 }
            });

            const res = await request(server).get('/city/123');
            expect(res.statusCode).toEqual(404);
        });
        it ('should return a city by id', async () => {
            City.findById.mockResolvedValue({
                name: 'Stockholm',
                position: { lat: 59.329323, lng: 18.068581 },
                _id: '5f7d0b9d3d7c9a0017c5a6f6'
            });

            const res = await request(server).get('/city/5f7d0b9d3d7c9a0017c5a6f6');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeInstanceOf(Object);
            expect(res.body.data.name).toEqual('Stockholm');
        });
        it ('should return a city by name', async () => {
            City.findOne.mockResolvedValue({
                name: 'Stockholm',
                position: { lat: 59.329323, lng: 18.068581 },
                _id: '5f7d0b9d3d7c9a0017c5a6f6'
            });

            const res = await request(server).get('/city/Stockholm');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeInstanceOf(Object);
            expect(res.body.data.name).toEqual('Stockholm');
        });
    });

    describe('DELETE /city', () => {
        it ('should return a deletedCount of 0', async () => {
            City.deleteMany.mockResolvedValue({ n: 3, ok: 1, deletedCount: 0 });
            const res = await request(server).delete('/city');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeInstanceOf(Object);
            expect(res.body.data.deletedCount).toEqual(0);
        });
        it ('should delete all cities', async () => {
            City.deleteMany.mockResolvedValue({ n: 3, ok: 1, deletedCount: 3 });
            const res = await request(server).delete('/city');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeInstanceOf(Object);
            expect(res.body.data.deletedCount).toEqual(3);
        });
    });
});
