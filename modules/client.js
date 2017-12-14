const rest = require('restler');

/**
 * Client to Communicate with API Server
 * @param api: API Server URL
 * @param pi: Device (Raspberry Pi) ID
 * @param user: Username
 * @param cb: Callback API URL
 * @returns {{}}
 */
module.exports = function(api, pi, user, cb) {
    const module = {};

    /**
     * Register Thingy on API Server
     * @returns {*}
     */
    module.registerDevice = function() {
        const data = {
            pi: pi,
            thingy: this.id,
            user: user,
            cb: cb
        };
        return rest.putJson(api + '/' + this.id, data, {rejectUnauthorized:false});
    };

    /**
     * Load Settings from API Server
     * @returns {*}
     */
    module.getSettings = function() {
        return rest.get(api + '/' + this.id + '/setup', {rejectUnauthorized:false});
    };

    /**
     * Load LED Config from API Server
     * @returns {*}
     */
    module.getLed = function() {
        return rest.get(api + '/' + this.id + '/actuators/led', {rejectUnauthorized:false});
    };

    /**
     * Send Sensor Data as POST to API Server
     * @param sensor: [temperature, pressure, humidity, color, gas, button]
     * @param data: sensor data (timestamp added)
     * @returns {*}
     */
    function sendSensorData(sensor, data){
        data.timestamp = new Date().getTime();
        return rest.postJson(api + '/' + this.id + '/sensors/' + sensor, data, {rejectUnauthorized:false});
    }

    /**
     * Send Temperature Data
     * @param temperature
     * @returns {*}
     */
    module.sendTemperature = function(temperature) {
        return sendSensorData.call(this, 'temperature', {
            temperature : temperature
        });
    };

    /**
     * Send Pressure Data
     * @param pressure
     * @returns {*}
     */
    module.sendPressure = function(pressure) {
        return sendSensorData.call(this, 'pressure', {
            pressure : pressure
        });
    };

    /**
     * Send Humidity Data
     * @param humidity
     * @returns {*}
     */
    module.sendHumidity = function(humidity) {
        return sendSensorData.call(this, 'humidity', {
            humidity : humidity
        });
    };

    /**
     * Send Color Data
     * @param color
     * @returns {*}
     */
    module.sendColor = function(color) {
        return sendSensorData.call(this, 'color', {
            color : color
        });
    };

    /**
     * Send Gas Data
     * @param gas
     * @returns {*}
     */
    module.sendGas = function(gas) {
        return sendSensorData.call(this, 'gas', {
            gas : gas
        });
    };

    /**
     * Send Button Data
     * @param state
     * @returns {*}
     */
    module.sendButton = function(state) {
        return sendSensorData.call(this, 'button', {
            button : {
                state : state
            }
        });
    };

    return module;
};
