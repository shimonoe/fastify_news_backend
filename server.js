/*
 * Fastify server configuration
 */
'use strict';

// Imports
const fs = require('fs');
const path = require('path');
const jwtConfig = require('./jwt.config');


// Fastify instance
const fastify = require('fastify')({
    logger: true,
    https2: true,
    https: {
        allowHTTP1: true,
        key: fs.readFileSync(path.join(__dirname, '.', 'certs', 'server.key')),
        cert: fs.readFileSync(path.join(__dirname, '.', 'certs', 'server.cert')),
    },
    serverFactory: require("fastify-http2https")(),
});

// Plugins
fastify.register(require('fastify-jwt'), jwtConfig);
fastify.register(require('fastify-formbody'));
fastify.register(require('fastify-helmet'));
fastify.register(require('fastify-rate-limit'), {
    max: 100, timeWindow: '60 seconds'
});
fastify.register(require('fastify-cors'), {
    origin: "*",
    methods: ['GET', 'POST'],
    exposedHeaders: ['Authorization']
});


// Routes
const routes = require('./routes');
routes.map(route => {
    fastify.route(route);
});

// Server instance object
const startServer = async (context) => {
    try {
        await fastify.listen(8000, '0.0.0.0');
        fastify.log.info('Server is up and running!');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

module.exports = startServer;
