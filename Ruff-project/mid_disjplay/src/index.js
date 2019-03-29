'use strict';

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }
    console.log('Welcome!');
    // get_temperature();
    // get_humidity();
    // get_illuminance();
    // bee();
    // light();
    //利用温湿度传感器得到温度并输出到LCD
    setInterval(
        function () {
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

    function get_temperature() {
        $('#DHT11').getTemperature(function (error, temperature) {
            if (error) {
                console.error(error);
                return;
            }
            $('#LCD1602-02').setCursor(1, 0);
            console.log('temperature', temperature);
            // $('#LCD1602-02').print('temperature: ' + temperature);
            return temperature;
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
            // $('#LCD1602-02').print('humidity: ' + humidity);
            return humidity;
        });
    }


    // setInterval(function () {
    //     //利用光照传感器得到光强
    //     $('#GY-30').getIlluminance(function(err, value){
    //         console.log(value);
    //         console.log('LIGHT:' + value);
    //     });
    // }, 1000)

    function get_illuminance () {
            //利用光照传感器得到光强
            $('#GY-30').getIlluminance(function(err, value){
                console.log(value);
                console.log('LIGHT:' + value);
                return value;
            });
        }

    $('#SOUND-01').on('sound', function() {
        console.log('sound detected');
    });

    $('#MH-FMG').buzz();
    $('#MH-FMG').unbuzz();
});

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
    $('#MH-FMG').buzz();
    console.log('Bee');
}

function stopBee(){
    $('#FC-49').turnOff(function (error) {
        if (error) {
            console.error(error);
            return;
        }});
    console.log('Stop bee');
    $('#MH-FMG').unbuzz();
}

function light(){
    $('#KY-016').turnOn();
}

function stopLight(){
    $('#KY-016').turnOff();
}

