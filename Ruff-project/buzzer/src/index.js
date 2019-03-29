'use strict';

var http = require('http');

var options = {
    host: 'httpbin.org',
    path: '/post',
    method: 'POST',
    headers: {
    }
};

function postState(state) {
    options.headers['Content-Length'] = state.length;
    var req = http.request(options, function(res) {
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    req.write(state);
    req.end();
}

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    console.log('Welcome!');

    //If the button is pressed, make the buzzer beep
    $('#CK002').on('push', function (){
        beep();
        postState('turn on');
    });

    //Stop beeping if the button is released
    $('#CK002').on('release', function (){
        stopBeeping();
        postState('turn off');
    });
});

//Beep only once
function shortBeep(){
    beee();
    stopBeee();
}

//Start beeping
function beep(){
    $('#FC-49').turnOn(function (error) {
        if (error) {
            console.error(error);
            return;
        }});
    console.log('Beep');
}

//Stop beeping
function stopBeeping() {
    $('#FC-49').turnOff(function (error) {
        if (error) {
            console.error(error);
            return;
        }
    });
    console.log('Stop beeping');
}