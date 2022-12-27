#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js';
import http from 'http';
import logFactory from '../services/log-factory.js';
import config from '../config.js';

// Show the webservices trace if not running in production.
if (config._trace && !config.environment.isProduction()) {
    console.log("%o", config._trace.ws);
}
const log = logFactory('server');
app.set('port', config.appSettings.port);
// Create HTTP server.
var server = http.createServer(app);
// Listen on provided port, on all network interfaces.
server.listen(config.appSettings.port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            log.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            log.error('Port {Port} is already in use.  Cannot continue.', config.appSettings.port);
            if (!config.environment.isProduction()) {
                log.verbose(`Try a different port number in the config.${config.environment.value}.json configuration file.`);
            }
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    log.info('Server starting.  Current environment:  {Environment}', config.environment.value);
    log.info('Listening on port {Port}.', addr.port);
}
