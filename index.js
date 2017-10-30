console.log('... started script, first line');
//const isDocker = require('is-docker');
var Thingy = require('thingy52');

// Check if the process is running inside a Docker container
//if (isDocker()) {
//    console.log('Running inside a Docker container');
//} else {
//    console.log('NOT running inside a Docker container');
//}

var events = function (api_root) {
    var client = require('./client')(api_root);
    return require('./events')(client);
}

function* discoverByIds(uuids) {
    for (var uuid of uuids) {
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
        describe: 'Root URL of server API',
        default: 'http://127.0.0.1:8080'
    })
    yargs.option('user', {
        describe: 'Username',
        default: 'tester'
    })
    yargs.option('sse',{
        describe: 'Enable server-sent events',
        default: false
    })
}

const argv = require('yargs')
.command('connect [uuids..]', 'Connect to device(s) with specified [uuids..] (= MACs) and connect to <api-root>', builder, (argv) => {
    var uuids = [];
    uuids = argv.uuids.map(function(e) {
        return e.toString().replace(/:/g,'').toLowerCase();
    });
    console.log('Search for device UUIDs: ' + uuids);

    Promise.all(discoverByIds(uuids)).then(devices => {
        console.log('Discovered all devices!');
        for (var thingy of devices) {
            events(argv.api).onDiscover(thingy, argv.sse);
        }
    });
})
.command('discover', 'Discover all devices and connect to <api-root>', builder, (argv) => {
    Thingy.discoverAll(function (thingy) {
        console.log('Discovered: ' + thingy);
    });
})
.help()
.argv
