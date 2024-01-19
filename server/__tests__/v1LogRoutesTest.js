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

    describe('DELETE /log', () => {
        it('should return a 200 response', async () => {
            Log.deleteMany.mockResolvedValue({ deletedCount: 1 });
            const res = await request(server).delete('/log');
            expect(res.statusCode).toEqual(200);
        });
        it('should return a 500 response on server error', async () => {
            Log.find.mockRejectedValue(new Error('Internal server error'));

            const res = await request(server).get('/log');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal server error');
        });
    });

    describe('GET /log/:id', () => {
        it('should return a 200 response', async () => {
            Log.findById.mockResolvedValue({
                _id: '6065c5e6d7d8d8b4c8a2e0f1',
                start_position: { lat: 59.329323, lng: 18.068581 },
                end_position: { lat: 59.329323, lng: 18.068581 },
                from_time: '2021-04-01T12:00:00.000Z',
                to_time: '2021-04-01T12:00:00.000Z'
            });
            const res = await request(server).get('/log/6065c5e6d7d8d8b4c8a2e0f1');
            expect(res.statusCode).toEqual(200);
        });
        it('should return a 404 response', async () => {
            Log.findById.mockResolvedValue(null);
            const res = await request(server).get('/log/6065c5e6d7d8d8b4c8a2e0f1');
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('PUT /log/:id', () => {
        it('should return a 200 response', async () => {
            // Mocking Log.findById to simulate finding the log
            Log.findById.mockResolvedValue({
                _id: '6065c5e6d7d8d8b4c8a2e0f1',
                start_position: { lat: 59.329323, lng: 18.068581 },
                end_position: { lat: 59.329323, lng: 18.068581 },
                from_time: '2021-04-01T12:00:00.000Z',
                to_time: '2021-04-01T12:00:00.000Z'
            });
    
            // Mocking Log.findByIdAndUpdate to simulate updating the log
            Log.findByIdAndUpdate.mockResolvedValue({
                _id: '6065c5e6d7d8d8b4c8a2e0f1',
                start_position: { lat: 59.329323, lng: 18.068581 },
                end_position: { lat: 60.329323, lng: 19.068581 }, // Assume this is the updated data
                from_time: '2021-04-01T12:00:00.000Z',
                to_time: '2021-04-02T12:00:00.000Z' // Assume this is the updated data
            });
    
            // Making the PUT request
            res = await request(server).put('/log/6065c5e6d7d8d8b4c8a2e0f1')
                .send({
                    end_position: { lat: 60.329323, lng: 19.068581 }, // Updated data
                    to_time: '2021-04-02T12:00:00.000Z' // Updated data
                });
            expect(res.statusCode).toEqual(200);
        });
        it('should return a 404 response', async () => {
            Log.findById.mockResolvedValue(null);
            const res = await request(server).put('/log/6065c5e6d7d8d8b4c8a2e0f1')
                .send({
                    end_position: { lat: 60.329323, lng: 19.068581 }, // Updated data
                    to_time: '2021-04-02T12:00:00.000Z' // Updated data
                });
            expect(res.statusCode).toEqual(404);
        });
        it('should return a 500 response on server error', async () => {
            Log.findById.mockRejectedValue(new Error('Internal server error'));
            const res = await request(server).put('/log/6065c5e6d7d8d8b4c8a2e0f1')
                .send({
                    end_position: { lat: 60.329323, lng: 19.068581 }, // Updated data
                    to_time: '2021-04-02T12:00:00.000Z' // Updated data
                });
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal server error');
        });
    });
    
    describe('DELETE /log/:id', () => {
        it('should return a 200 response when log is successfully deleted', async () => {
            // Mock delete one to simulate successful deletion
            Log.deleteOne.mockResolvedValue({ deletedCount: 1 });

            const res = await request(server).delete('/log/6065c5e6d7d8d8b4c8a2e0f1');
            expect(res.statusCode).toEqual(200);
        });

        it('should return a 404 response when log is not found', async () => {
            // Mock delete one to simulate no deletion
            Log.deleteOne.mockResolvedValue({ deletedCount: 0 });

            const res = await request(server).delete('/log/6065c5e6d7d8d8b4c8a2e0f1');
            expect(res.statusCode).toEqual(404);
        });

        it('should return a 500 response on server error', async () => {
            // Mock delete one to simulate server error
            Log.deleteOne.mockRejectedValue(new Error('Internal server error'));

            const res = await request(server).delete('/log/6065c5e6d7d8d8b4c8a2e0f1');
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal server error');
        });
    });
});

