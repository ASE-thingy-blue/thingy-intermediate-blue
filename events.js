/*
  Copyright (c) 2010 - 2017, Nordic Semiconductor ASA
  All rights reserved.
  Redistribution and use in source and binary forms, with or without modification,
  are permitted provided that the following conditions are met:
  1. Redistributions of source code must retain the above copyright notice, this
     list of conditions and the following disclaimer.
  2. Redistributions in binary form, except as embedded into a Nordic
     Semiconductor ASA integrated circuit in a product or a software update for
     such product, must reproduce the above copyright notice, this list of
     conditions and the following disclaimer in the documentation and/or other
     materials provided with the distribution.
  3. Neither the name of Nordic Semiconductor ASA nor the names of its
     contributors may be used to endorse or promote products derived from this
     software without specific prior written permission.
  4. This software, with or without modification, must only be used with a
     Nordic Semiconductor ASA integrated circuit.
  5. Any software provided in binary form under this license must not be reverse
     engineered, decompiled, modified and/or disassembled.
  THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS
  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
  OF MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE
  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
  HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
  LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
  OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


var client;

function setup(settings){
    this.temperature_interval_set(settings.temperature.interval, function(error) {
        if (error) {
            console.log('Temperature sensor configure! ' + error);
        }
    });
    this.pressure_interval_set(settings.pressure.interval, function(error) {
        if (error) {
            console.log('Pressure sensor configure! ' + error);
        }
    });
    this.humidity_interval_set(settings.humidity.interval, function(error) {
        if (error) {
            console.log('Humidity sensor configure! ' + error);
        }
    });
    this.color_interval_set(settings.color.interval, function(error) {
        if (error) {
            console.log('Color sensor configure! ' + error);
        }
    });
    this.gas_mode_set(settings.gas.mode, function(error) {
        if (error) {
            console.log('Gas sensor configure! ' + error);
        }
    });
}

function onDiscover(thingy, enableEventSource) {
  console.log('Discovered: ' + thingy);

  thingy.on('disconnect', function() {
    console.log('Disconnected!');
  });

  thingy.connectAndSetUp(function(error) {
    console.log('Connected! ' + error ? error : '');

    thingy.on('temperatureNotif', client.sendTemperature.bind(thingy));
    thingy.on('pressureNotif', client.sendPressure.bind(thingy));
    thingy.on('humidityNotif', client.sendHumidity.bind(thingy));
    thingy.on('gasNotif', client.sendGas.bind(thingy));
    thingy.on('colorNotif', client.sendColor.bind(thingy));
    thingy.on('buttonNotif', client.sendButton.bind(thingy));

    client.getSettings.call(thingy).on('complete', setup.bind(thingy));
    if (enableEventSource) {
	console.log('getLedSource');
        client.getLedSource.call(thingy, function (e) {
            thingy.led_breathe(JSON.parse(e.data));
        });
    } else {
        setInterval(() => client.getLed.call(thingy).on('complete', thingy.led_breathe.bind(thingy)), 1000);
    }
    thingy.enabled = true;

    thingy.temperature_enable(function(error) {
        console.log('Temperature sensor started! ' + ((error) ? error : ''));
    });
    thingy.pressure_enable(function(error) {
        console.log('Pressure sensor started! ' + ((error) ? error : ''));
    });
    thingy.humidity_enable(function(error) {
        console.log('Humidity sensor started! ' + ((error) ? error : ''));
    });
    thingy.color_enable(function(error) {
        console.log('Color sensor started! ' + ((error) ? error : ''));
    });
    thingy.gas_enable(function(error) {
        console.log('Gas sensor started! ' + ((error) ? error : ''));
    });
    thingy.button_enable(function(error) {
        console.log('Button started! ' + ((error) ? error : ''));
    });
  });
}

module.exports = function(_client, enableEventSource) {
    var module = {};
    console.log('Reading Thingy environment sensors!');
    client = _client;
    module.onDiscover = onDiscover.bind({enableEventSource: enableEventSource});
    return module;
};
