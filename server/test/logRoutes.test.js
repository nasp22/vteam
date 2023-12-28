// server/test/logRoutes.test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');
const should = chai.should();
const sinon = require('sinon');
const Log = require('../models/log.js');
const { default: mongoose } = require('mongoose');

chai.use(chaiHttp);

describe('Log Routes', () => {
    // Test for Get /log - fetch all logs
    describe('GET /log', function() {
        this.timeout(10000);
        it('should return all logs', (done) => {
            chai.request(server)
                .get('/log')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(true);
                    res.body.message.should.equal('Logs retrieved successfully');
                    res.body.data.should.be.a('array');
                    done();
                });
        });
    });

    // Test for POST /log - add a new log
    describe('POST /log', function() {
        this.timeout(10000);
        it('should add a new log', (done) => {
            chai.request(server)
                .post('/log')
                .send({
                    from_station: {
                        name: 'Centralstation',
                        city: 'Göteborg'
                    },
                    to_station: {
                        name: 'Domkyrkan',
                        city: 'Göteborg'
                    },
                    from_time: new Date()
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.success.should.equal(true);
                    res.body.message.should.equal('Log added successfully');
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('from_station');
                    res.body.data.should.have.property('to_station');
                    res.body.data.should.have.property('from_time');
                    done();
                });
        });
        it('should return an error if from_station is missing', (done) => {
            chai.request(server)
                .post('/log')
                .send({
                    to_station: {
                        name: 'Domkyrkan',
                        city: 'Göteborg'
                    },
                    from_time: new Date()
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.success.should.equal(false);
                    res.body.message.should.equal("'from station name is required'");
                    done();
                });
        });
        after((done) => {
            server.close(() => {
                console.log('Server closed');
            });

            mongoose.disconnect(() => {
                console.log('Database connection closed');
                done();
        });
    });
});
});
