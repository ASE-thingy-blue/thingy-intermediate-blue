// Example POST method invocation
var rest = require('restler');
var EventSource = require('eventsource');

module.exports = function(base_uri)
{
    var module = {};

    module.logResponse = function(data, response)
    {
        // Parsed response body as JS object
        console.log(data);
        // Raw response
        console.log(response);
    };

    function sendSensorData(sensor, data)
    {
        data.timestamp = new Date().getTime();
        return rest.postJson(base_uri + '/' + this.id + '/sensors/' + sensor, data);
    }

    module.sendTemperature = function(temperature)
    {
        return sendSensorData.call(this, 'temperature',
        {
            temperature : temperature
        });
    };

    module.sendPressure = function(pressure)
    {
        return sendSensorData.call(this, 'pressure',
        {
            pressure : pressure
        });
    };

    module.sendHumidity = function(humidity)
    {
        return sendSensorData.call(this, 'humidity',
        {
            humidity : humidity
        });
    };

    module.sendColor = function(color)
    {
        return sendSensorData.call(this, 'color',
        {
            color : color
        });
    };

    module.sendGas = function(gas)
    {
        return sendSensorData.call(this, 'gas',
        {
            gas : gas
        });
    };

    module.sendButton = function(state)
    {
        return sendSensorData.call(this, 'button',
        {
            button :
            {
                state : state
            }
        });
    };

    module.getSettings = function()
    {
        return rest.get(base_uri + '/' + this.id + '/setup');
    };

    module.getLed = function()
    {
        return rest.get(base_uri + '/' + this.id + '/actuators/led');
    };

    module.getLedSource = function(onmessage, onerror)
    {
        var source = new EventSource(base_uri + '/' + this.id + '/actuators/led');
        source.onmessage = onmessage;
        if (onerror) source.onerror = onerror;
    }

    return module;
};
