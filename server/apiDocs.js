// server/apiDocs.js

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Elspackcyklar API',
            description: 'Elspackcyklar API Information',
            contact: {
                name: 'Elspackcyklar AB'
            },
            version: '1.0.0'
        },
        servers: [{ url: 'http://172.25.53.25:1337'}, { url: 'http://localhost:1337' }],
        components: {
            schemas: {
                Log: {
                    type: 'object',
                    properties: {
                        from_station: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                id: { type: 'string', format: 'uuid' },
                                city: { type: 'string' }
                            }
                        },
                        to_station: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                id: { type: 'string', format: 'uuid' },
                                city: { type: 'string' }
                            }
                        },
                        from_time: { type: 'string', format: 'date-time' },
                        to_time: { type: 'string', format: 'date-time' }
                    }
                },
                LogPost: {
                    type: 'object',
                    properties: {
                        from_station: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                id: { type: 'string', format: 'uuid' },
                                city: { type: 'string' }
                            },
                            description: 'Either `id` or both `name` and `city` are required.'
                        },
                        to_station: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                id: { type: 'string', format: 'uuid' },
                                city: { type: 'string' }
                            },
                            description: 'Either `id` or both `name` and `city` are required.'
                        },
                        from_time: { type: 'string', format: 'date-time' },
                        to_time: { type: 'string', format: 'date-time' }
                    },
                    required: ['from_station', 'to_station', 'from_time']
                    
                },
                City: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        id: { type: 'string', format: 'uuid' },
                        position: {
                            type: 'object',
                            properties: {
                                lat: { type: 'number' },
                                lng: { type: 'number' }
                            }
                        },
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        auth_id: { type: 'string' },
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                        email: { type: 'string' },
                        status: { type: 'string' },
                        role: { type: 'string' },
                        credit_amount: { type: 'number' },
                        phone_number: { type: 'string' },
                        log: {
                            type: 'array',
                            items: {
                                type: 'object'
                            }
                        }
                    }
                },
                UserInput: {
                    type: 'object',
                    required: ['first_name', 'last_name', 'email'],
                    properties: {
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                        email: { type: 'string' },
                        status: { type: 'string' },
                        role: { type: 'string' },
                        credit_amount: { type: 'number' },
                        phone_number: { type: 'string' }
                    }
                },
                Station: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        scooters: {
                            type: 'array',
                            items: { type: 'string', format: 'uuid' }
                        },
                        position: {
                            type: 'object',
                            properties: {
                                lat: { type: 'number' },
                                lng: { type: 'number' }
                            }
                        },
                        city: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                id: { type: 'string', format: 'uuid' }
                            }
                        }
                    }
                },
                StationInput: {
                    type: 'object',
                    required: ['name', 'position', 'city'],
                    properties: {
                        name: { type: 'string' },
                        scooters: {
                            type: 'array',
                            items: { type: 'string', format: 'uuid' }
                        },
                        position: {
                            type: 'object',
                            properties: {
                                lat: { type: 'number' },
                                lng: { type: 'number' }
                            }
                        },
                        city: { type: 'string' }
                    }
                }
            }
        }
    },
    apis: ['./index.js', './routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const swaggerUiOptions = {
    explorer: true
};

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));
};
