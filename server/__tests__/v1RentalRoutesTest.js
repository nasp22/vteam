// server/__tests__/v1RentalRoutesTest.js

const request = require('supertest');
const server = require('../server.js');
const Rental = require('../models/rental.js');
const User = require('../models/user.js');
const Scooter = require('../models/scooter.js');
const mongoose = require('mongoose');
const { findScooter } = require('../utils.js');

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
jest.mock('../models/rental.js');
jest.mock('../models/user.js');
jest.mock('../models/scooter.js', () => {
    return {
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

describe('v1RentalRoutesTest', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        Rental.find.mockClear();
    });

    afterAll(async () => {
        // Close the database connection
        await new Promise(resolve => server.close(resolve));
        await mongoose.connection.close();
    }, 15000); // 15 seconds

    describe('GET /rent', () => {
        it ('should return all rentals', async () => {
            Rental.find.mockResolvedValue([
                    { startfee: 10 },
                    { startfee: 20 },
                    { startfee: 30 }
                ]);

            const res = await request(server).get('/rent');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.data.length).toEqual(3);
        }, 15000); // 15 seconds
    });

    describe('GET /rent/:id', () => {
        it ('should return a 404 response', async () => {
            Rental.findById.mockResolvedValue(null);

            const res = await request(server).get('/rent/123');
            expect(res.statusCode).toEqual(404);
        });
        it ('should return a rental', async () => {
            Rental.findById.mockResolvedValue({ startfee: 10, _id: '5f7d0b9d3d7c9a0017c5a6f6' });

            const res = await request(server).get('/rent/5f7d0b9d3d7c9a0017c5a6f6');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveProperty('startfee', 10);
        });
    });

    describe('Delete /rent', () => {
        it ('should return a 200 response', async () => {
            Rental.deleteMany.mockResolvedValue({ deletedCount: 3 });

            const res = await request(server).delete('/rent');
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('POST /rent/:scooter_id/:user_id', () => {
        it ('should return a 201 response', async () => {
            Rental.create.mockResolvedValue({ startfee: 10, _id: '5f7d0b9d3d7c9a0017c5a6f6' });
            User.findById.mockResolvedValue({ _id: '5f7d0b9d3d7c9a0017c5a6f6' });
            Scooter.findById.mockResolvedValue({ _id: '5f7d0b9d3d7c9a0017c5a6f6' });

            const res = await request(server).post('/rent/5f7d0b9d3d7c9a0017c5a6f6/5f7d0b9d3d7c9a0017c5a6f6')
                .send({ startfee: 10 });
            expect(res.statusCode).toEqual(201);
        });
        it ('should return a 404 response, scooter not found', async () => {
            Rental.create.mockResolvedValue({ startfee: 10, _id: '5f7d0b9d3d7c9a0017c5a6f6' });
            User.findById.mockResolvedValue({ _id: '5f7d0b9d3d7c9a0017c5a6f6' });
            Scooter.findById.mockResolvedValue(null);

            const res = await request(server).post('/rent/5f7d0b9d3d7c9a0017c5a6f6/5f7d0b9d3d7c9a0017c5a6f6')
                .send({ startfee: 10 });
            expect(res.statusCode).toEqual(404);
        });
        it ('should return a 404 response, user not found', async () => {
            Rental.create.mockResolvedValue({ startfee: 10, _id: '5f7d0b9d3d7c9a0017c5a6f6' });
            User.findById.mockResolvedValue(null);
            Scooter.findById.mockResolvedValue({ _id: '5f7d0b9d3d7c9a0017c5a6f6' });

            const res = await request(server).post('/rent/5f7d0b9d3d7c9a0017c5a6f6/5f7d0b9d3d7c9a0017c5a6f6')
                .send({ startfee: 10 });
            expect(res.statusCode).toEqual(404);
        });
        it('should return a 201 respose using auth_id', async () => {
            Rental.create.mockResolvedValue({ startfee: 10, _id: '5f7d0b9d3d7c9a0017c5a6f6' });
            User.findOne.mockResolvedValue({ _id: '5f7d0b9d3d7c9a0017c5a6f6' });
            Scooter.findById.mockResolvedValue({ _id: '5f7d0b9d3d7c9a0017c5a6f6' });

            const res = await request(server).post('/rent/5f7d0b9d3d7c9a0017c5a6f6/123')
                .send({ startfee: 10 });
            expect(res.statusCode).toEqual(201);
        });
        it ('should return a 400 response, no startfee', async () => {
            Rental.create.mockResolvedValue({ startfee: 10, _id: '5f7d0b9d3d7c9a0017c5a6f6' });
            User.findById.mockResolvedValue({ _id: '5f7d0b9d3d7c9a0017c5a6f6' });
            Scooter.findById.mockResolvedValue({ _id: '5f7d0b9d3d7c9a0017c5a6f6' });

            const res = await request(server).post('/rent/5f7d0b9d3d7c9a0017c5a6f6/5f7d0b9d3d7c9a0017c5a6f6');
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('PUT /rent/:id', () => {
        it ('should return a 404 response', async () => {
            Rental.findById.mockResolvedValue(null);

            const res = await request(server).put('/rent/123').send({ startfee: 10 });
            expect(res.statusCode).toEqual(404);
        });
        it('should return a 200 response', async () => {
            const mockRental = {
                startfee: 10,
                _id: '5f7d0b9d3d7c9a0017c5a6f6',
                set: jest.fn().mockReturnThis(), // Add a mock implementation for set
                save: jest.fn().mockResolvedValue({
                    startfee: 20,
                    _id: '5f7d0b9d3d7c9a0017c5a6f6'
                })
            };
            Rental.findById.mockResolvedValue(mockRental);
    
            const res = await request(server).put('/rent/5f7d0b9d3d7c9a0017c5a6f6').send({ startfee: 20 });
            expect(res.statusCode).toEqual(200);
        });
        it ('should return a 500 respons', async () => {
            const mockRental = {
                startfee: 10,
                _id: '5f7d0b9d3d7c9a0017c5a6f6',
                set: jest.fn().mockReturnThis(), // Add a mock implementation for set
                save: jest.fn().mockRejectedValue(null)
            };
            Rental.findById.mockResolvedValue(mockRental);
    
            const res = await request(server).put('/rent/5f7d0b9d3d7c9a0017c5a6f6').send({ startfee: 20 });
            expect(res.statusCode).toEqual(500);
        });
    });

    describe('DELETE /rent/:id', () => {
        it ('should return a 404 response', async () => {
            Rental.deleteOne.mockResolvedValue({ deletedCount: 0 });

            const res = await request(server).delete('/rent/123');
            expect(res.statusCode).toEqual(404);
        });
        it ('should return a 200 response', async () => {
            Rental.deleteOne.mockResolvedValue({ deletedCount: 1 });
            const res = await request(server).delete('/rent/5f7d0b9d3d7c9a0017c5a6f6');
            expect(res.statusCode).toEqual(200);
        });
    });
});
