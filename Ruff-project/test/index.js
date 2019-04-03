$.ready(function (error) {
    var http = require('http');
    //('#MH-FMG').buzz();
    bee();
    stopBee();
    light();
    //NFC();

    http.createServer(function (request, response) {
        var url = request.url;
        if (url == "/") {
            reportInfo(request, response);
            return;
        }
        else if (url == "/turn-off-light") {
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write("turn off light");
            stopLight();
            response.end();
        }
        else if (url == "/turn-on-light") {
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write("turn on light");
            light();
            response.end();
        }
        else if (url == "/bee") {
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write("begin bee");
            bee();
            response.end();
        }
        else if (url == "/stop-bee") {
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write("stop bee");
            stopBee();
            response.end();
        }
        else {
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write("not found!");
            response.end();
        }

    }).listen(3000, '192.168.78.1');

    console.log('Server running on port 3000.');

    if (error) {
        console.log(error);
        return;
    }
    console.log("Welcome!");

    $('#SOUND-01').on('sound', function () {
        console.log('sound detected');
    });
});


function reportInfo(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});

    var html = "{";
    $('#DHT11').getTemperature(function (error, temperature) {
        if (error) {
            response.end();
            return;
        }
        html = html + '"temperature" :' + temperature + ",";
        $('#DHT11').getRelativeHumidity(function (error, humidity) {
            if (error) {
                response.end();
                return;
            }
            html = html + '"humidity":' + humidity + ",";
            $('#GY-30').getIlluminance(function(err, value) {
                if (err) {
                    response.end();
                    return;
                }
                html = html + '"light":' + value + "}";
                response.write(html);
                response.end();
            });
        });
    });
}

function light() {
    $('#KY-016').turnOn();
}

function stopLight() {
    $('#KY-016').turnOff();
}

function bee() {
    $('#MH-FMG').turnOn(function (error) {
        if (error) {
            console.error(error);
            return;
        }
    });
    console.log('Bee');
}

function stopBee() {
    $('#MH-FMG').turnOff(function (error) {
        if (error) {
            console.error(error);
            return;
        }
    });
    console.log('Stop bee');
}

function NFC() {
    $('#PN532').on('tag', function (tag) {
        console.log('the uid of tag is ', tag.uid.toString('hex'));
    });
}
