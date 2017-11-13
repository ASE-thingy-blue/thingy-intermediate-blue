const isDocker = require('is-docker');
const Thingy = require('thingy52');

// Check if the process is running inside a Docker container
if (isDocker()) {
    console.log('Running inside a Docker container');
} else {
    console.log('NOT running inside a Docker container');
}

const events = function (api, pi, user, cb) {
    const client = require('./modules/client')(api, pi, user, cb);
    return require('./modules/events')(client, pi, user);
};

const server = function (pi, user) {
    return require('./modules/server')(pi, user);
};

function* discoverByIds(uuids) {
    for (const uuid of uuids) {
        yield new Promise((resolve, reject) => {
            Thingy.discoverById(uuid, function(thingy) {
                console.log('Discovered: ' + thingy);
                resolve(thingy);
            });
        });
    }
}

builder = (yargs) => {
    yargs.option('api', {
        describe: 'Root URL of Server API.',
        default: 'http://test.termon.pillo-srv.ch/thingy'
    });
    yargs.option('pi', {
        describe: 'Device ID of Raspberry Pi.',
        default: 'pi-thingy-blue'
    });
    yargs.option('user', {
        describe: 'Username of Server API User.',
        default: 'tester'
    });
    yargs.option('cb', {
        describe: 'Callback URL of Intermediate API.',
        default: ''
    })
};

const argv = require('yargs')
.command('connect [uuids..]', 'Connect to device(s) with specified [uuids..] (= MACs) and connect to <api-root>', builder, (argv) => {
    let uuids = [];
    uuids = argv.uuids.map(function(e) {
        return e.toString().replace(/:/g,'').toLowerCase();
    });
    console.log('Search for device UUIDs: ' + uuids);

    Promise.all(discoverByIds(uuids)).then(devices => {
        console.log('Discovered all devices!');
        for (const thingy of devices) {
            events(argv.api, argv.pi, argv.user, argv.cb).onDiscover(thingy);
            //Server Disabled
            //server(argv.pi, argv.user).onDiscover(thingy);
        }
    });
})
.command('discover', 'Discover all devices and connect to <api-root>', builder, (argv) => {
    console.log('Search for device UUIDs...');
    Thingy.discoverAll(function (thingy) {
        console.log('Discovered: ' + thingy);
    });
})
.help()
.argv;
