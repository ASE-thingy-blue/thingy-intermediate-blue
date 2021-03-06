let client;
let pi;
let user;

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

        //Ask for LED Config each 2500ms
        setInterval(() =>
            client.getLed.call(thingy)
                .on('complete', setLed.bind(thingy))
                .on('timeout', setLed.bind(thingy))
                .on('error', setLed.bind(thingy))
            , 2500);

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

    let defaultSettings = {
        temperature: {interval: 15000},
        pressure: {interval: 15000},
        humidity: {interval: 15000},
        color: {interval: 15000},
        gas: {mode: 3}
    };

    //Are settings provided?
    if (settings === undefined) {
        console.log('Use default Thingy Sensor configuration.');
        settings = defaultSettings;
    }

    let ti = settings.temperature ? settings.temperature.interval : defaultSettings.temperature.interval;
    this.temperature_interval_set(ti, function(error) {
        if (error) {
            console.error('Temperature sensor configuration error: ' + error);
        }
    });

    let pi = settings.pressure ? settings.pressure.interval : defaultSettings.pressure.interval;
    this.pressure_interval_set(pi, function(error) {
        if (error) {
            console.error('Pressure sensor configuration error: ' + error);
        }
    });

    let hi = settings.humidity ? settings.humidity.interval : defaultSettings.humidity.interval;
    this.humidity_interval_set(hi, function(error) {
        if (error) {
            console.error('Humidity sensor configuration error: ' + error);
        }
    });

    let ci = settings.color ? settings.color.interval : defaultSettings.color.interval;
    this.color_interval_set(ci, function(error) {
        if (error) {
            console.error('Color sensor configuration error: ' + error);
        }
    });

    let gm = settings.gas ? settings.gas.mode : defaultSettings.gas.mode;
    this.gas_mode_set(gm, function(error) {
        if (error) {
            console.error('Gas sensor configuration error: ' + error);
        }
    });
}

/**
 * Set Thingy LED Color from Server Data
 * @param led
 */
function setLed(led) {

    let defaultLed = {
        color: 1,
        intensity: 10,
        delay: 2000
    };

    //Are settings provided?
    if (!led || !led.hasOwnProperty('color') || !led.hasOwnProperty('intensity') || !led.hasOwnProperty('delay')) {
        console.log('Use default Thingy Led configuration.');
        led = defaultLed;
    }

    this.led_breathe(led, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = function(_client, _pi, _user) {
    const module = {};
    console.log('Reading Thingy environment sensors!');
    client = _client;
    pi = _pi;
    user = _user;
    module.onDiscover = onDiscover.bind();
    return module;
};
