const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');

let pi;
let user;

/**
 * Start the Reverse API Server
 * @param thingy: thingy instance
 */
function onDiscover(thingy) {
    console.log('Discovered: ' + thingy + ', starting Reverse API...');

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
            let thingy = {
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

    server.start(function (err) {
        console.log('Server running at: ', server.info.uri);
    });

}

/**
 * Thingy Reverse API
 * @param _pi: Device (Raspberry Pi) ID
 * @param _user: Username
 * @returns {{}}
 */
module.exports = function(_pi, _user) {
    const module = {};
    console.log('Reading Thingy environment sensors!');
    pi = _pi;
    user = _user;
    module.onDiscover = onDiscover.bind();
    return module;
};