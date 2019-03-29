'use strict';

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    $('#LCD1602-02').turnOn();
    // $('#LCD1602-02').setCursor(1, 0);
    // $('#LCD1602-02').print('Welcome!');
    console.log('Welcome!');
    // console.log(get_temperature());
    // console.log(get_humidity());
    get_temperature();
    get_humidity();
        //利用温湿度传感器得到温度并输出到LCD
    // setInterval(
    //     function () {
    //     $('#DHT11').getTemperature(function (error, temperature) {
    //         if (error) {
    //             console.error(error);
    //             return;
    //         }
    //         $('#LCD1602-02').setCursor(1, 0);
    //         console.log('temperature', temperature);
    //         $('#LCD1602-02').print('temperature: ' + temperature);
    //     });
    // }, 1000);

        function get_temperature() {
            $('#DHT11').getTemperature(function (error, temperature) {
                if (error) {
                    console.error(error);
                    return;
                }
                $('#LCD1602-02').setCursor(1, 0);
                console.log('temperature', temperature);
                $('#LCD1602-02').print('temperature: ' + temperature);
                //return temperature;
            });
        }

        //利用温湿度传感器得到湿度并输出到LCD
        // setInterval(function () {
        //     $('#DHT11').getRelativeHumidity(function (error, humidity) {
        //         if (error) {
        //             console.error(error);
        //             return;
        //         }
        //         $('#LCD1602-02').setCursor(1, 1);
        //         console.log('humidity', humidity);
        //         $('#LCD1602-02').print('humidity: ' + humidity);
        //         return humidity;
        //     });
        // }, 1000)

      function get_humidity() {
        $('#DHT11').getRelativeHumidity(function (error, humidity) {
            if (error) {
                console.error(error);
                return;
            }
            $('#LCD1602-02').setCursor(1, 1);
            console.log('humidity', humidity);
            $('#LCD1602-02').print('humidity: ' + humidity);
            //return humidity;
        });
    }


    // setInterval(function () {
    //     //利用光照传感器得到光强
    //     $('#GY-30').getIlluminance(function(err, value){
    //         console.log(value);
    //         console.log('LIGHT:' + value);
    //     });
    // }, 1000)

    $('#SOUND-01').on('sound', function() {
        console.log('sound detected');
    });

    $('#IRR-01').on('data', function(data) {
        console.log('红外 received data', data);
    });

    $('#CK002').on('push', function () {
        //bee();
        $('#KY-016').turnOn();
        //relay();
        //state();
        dataSend();
    });

    $('#CK002').on('release', function () {
        stopBee();
        $('#KY-016').turnOff();
        //stopRelay();
    });
});

function relay() {
    $('#RELAY-1C').turnOn(function () {
        if (error) {
            console.error(error);
            return;
        }});
    console.log('继电器 turn on');
}

function state() {
    $('#RELAY-1C').isOn(function (error, state) {
        if (error) {
            console.error(error);
            return;
        }});
    console.log('the state is ' + state);
}

function stopRelay() {
    $('#RELAY-1C').turnOff(function () {
        if (error) {
            console.error(error);
            return;
    }});
    console.log('继电器 turn off');
}

function dataSend() {
    $('#IRT-01').send([1,2,3], function (error) {
        if (error) {
            console.error(error);
            return;
        }});
        console.log('红外data sent');

}

function beep(){
    bee();
    stopBee();
    console.log('Beeped');
}

function bee(){
    $('#FC-49').turnOn(function (error) {
        if (error) {
            console.error(error);
            return;
        }});
    console.log('Bee');
}

function stopBee(){
    $('#FC-49').turnOff(function (error) {
        if (error) {
            console.error(error);
            return;
        }});
    console.log('Stop bee');
}

'use strict';

var assert = require('assert');
var path = require('path');
var test = require('test');

var appRunner = require('ruff-app-runner');
var mock = require('ruff-mock');

var verify = mock.verify;

var appPath = path.join(__dirname, '..');

module.exports = {
    'test should run application': function (done) {
        appRunner
            .run(appPath, function () {
                verify($('#led-r')).turnOn();
            })
            .end(function () {
                verify($('#led-r')).turnOff();
                done();
            });
    }
};

test.run(module.exports);