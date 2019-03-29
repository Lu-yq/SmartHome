'use strict';

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    $('#LCD1602-02').turnOn();
    $('#LCD1602-02').setCursor(1, 0);
    $('#LCD1602-02').print('Welcome!');
    setInterval(function () {
        $('#DHT11').getTemperature(function (error, temperature) {
            if (error) {
                console.error(error);
                return;
            }
            $('#LCD1602-02').setCursor(1, 0);
            console.log('temperature', temperature);
            $('#LCD1602-02').print('temperature: ' + temperature);
        });
    }, 1000);
    setInterval(function () {
        $('#DHT11').getRelativeHumidity(function (error, humidity) {
            if (error) {
                console.error(error);
                return;
            }
            $('#LCD1602-02').setCursor(1, 1);
            console.log('humidity', humidity);
            $('#LCD1602-02').print('humidity: ' + humidity);
        });
    }, 1000)
    setInterval(function (){
        $('#gy-30').getIlluminance(function(err, value){

            if (error) {
                console.error(error);
                return;
            }
            $('#LCD1602-02').setCursor(1, 2);
            console.log('LIGHT', value);
            $('#LCD1602-02').print('LIGHT: ' + value);
        });
    }, 1000);
});