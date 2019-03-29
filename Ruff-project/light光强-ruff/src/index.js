'use strict';

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    console.log('Welcome!');

    setInterval(function (){
        $('#gy-30').getIlluminance(function(err, value){
            console.log(value);
            console.log('LIGHT:' + value);
        });
    }, 1000)
});


