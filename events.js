var client;

/**
 * Startup Thingy
 * @param thingy
 */
function onDiscover(thingy) {
    console.log('Discovered: ' + thingy);

    thingy.on('disconnect', function() {
        console.log('Disconnected!');
    });

    thingy.connectAndSetUp(function(error) {
        if (error) {
            console.error('Connection error: ' + error);
        } else {
            console.log('Connected!');
        }

        thingy.on('temperatureNotif', client.sendTemperature.bind(thingy));
        thingy.on('pressureNotif', client.sendPressure.bind(thingy));
        thingy.on('humidityNotif', client.sendHumidity.bind(thingy));
        thingy.on('gasNotif', client.sendGas.bind(thingy));
        thingy.on('colorNotif', client.sendColor.bind(thingy));
        thingy.on('buttonNotif', client.sendButton.bind(thingy));

        //Register Device on Server
        client.registerDevice.call(thingy).on('complete', function() {
            console.log('registerDevice done');
        });
        //Load Settings from Server
        client.getSettings.call(thingy).on('complete', setup.bind(thingy));
        //Ask for LED Config each 1000ms
        setInterval(() => client.getLed.call(thingy).on('complete', thingy.led_breathe.bind(thingy)), 1000);
        
        thingy.enabled = true;
        thingy.temperature_enable(function(error) {
            if (error) {
                console.error('Error starting temperature sensor: ' + error);
            } else {
                console.log('Temperature sensor started!');
            }
        });
        thingy.pressure_enable(function(error) {
            if (error) {
                console.error('Error starting pressure sensor: ' + error);
            } else {
                console.log('Pressure sensor started!');
            }
        });
        thingy.humidity_enable(function(error) {
            if (error) {
                console.error('Error starting humidity sensor: ' + error);
            } else {
                console.log('Humidity sensor started!');
            }
        });
        thingy.color_enable(function(error) {
            if (error) {
                console.error('Error starting color sensor: ' + error);
            } else {
                console.log('Color sensor started!');
            }
        });
        thingy.gas_enable(function(error) {
            if (error) {
                console.error('Error starting gas sensor: ' + error);
            } else {
                console.log('Gas sensor started!');
            }
        });
        thingy.button_enable(function(error) {
            if (error) {
                console.error('Error starting button: ' + error);
            } else {
                console.log('Button started!');
            }
        });
    });
}

/**
 * Set Thingy Settings from Server Data
 * @param settings
 */
function setup(settings) {
    this.temperature_interval_set(settings.temperature.interval, function(error) {
        if (error) {
            console.error('Temperature sensor configuration error: ' + error);
        }
    });
    this.pressure_interval_set(settings.pressure.interval, function(error) {
        if (error) {
            console.error('Pressure sensor configuration error: ' + error);
        }
    });
    this.humidity_interval_set(settings.humidity.interval, function(error) {
        if (error) {
            console.error('Humidity sensor configuration error: ' + error);
        }
    });
    this.color_interval_set(settings.color.interval, function(error) {
        if (error) {
            console.error('Color sensor configuration error: ' + error);
        }
    });
    this.gas_mode_set(settings.gas.mode, function(error) {
        if (error) {
            console.error('Gas sensor configuration error: ' + error);
        }
    });
}

module.exports = function(_client, enableEventSource) {
    var module = {};
    console.log('Reading Thingy environment sensors!');
    client = _client;
    module.onDiscover = onDiscover.bind();
    return module;
};
