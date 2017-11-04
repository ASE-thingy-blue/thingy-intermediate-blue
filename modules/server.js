const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');

/**
 * Thingy Reverse API
 * @param thingy: thingy instance
 * @param pi: Device (Raspberry Pi) ID
 * @param user: Username
 * @returns {{}}
 */
module.exports = function(thingy, pi, user) {
    var module = {};

    const server = new Hapi.Server();
    server.connection({
        host: '0.0.0.0',
        port: 8080,
        routes: {cors: true}
    });

    const swaggerOptions = {
        info: {
        'title': 'thingy-api-blue',
            'version': '1.0.0',
            'description': 'thingy-api-blue'
        }
    };

    server.register([
        Inert,
        Vision, {
            register: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply({success: true}).code(200);
        },
        config: {
            tags: ['thingy']
        }
    });

    server.route({
        method: 'GET',
        path: '/thingy',
        handler: function (request, reply) {
            var thingy = {
                pi: pi,
                thingy: this.id,
                user: user
            };
            reply(thingy).code(200);
        },
        config: {
            tags: ['thingy']
        }
    });

    return module;
};