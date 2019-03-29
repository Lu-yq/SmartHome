$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    // 在 `#button-k2` 按下时点亮 `#led-r`.
    $('#button-k2').on('push', function () {
        console.log('Button pushed.');
        $('#led-r').turnOn();
    });

    // 在 `#button-k2` 释放时熄灭 `#led-r`.
    $('#button-k2').on('release', function () {
        console.log('Button released.');
        $('#led-r').turnOff();
    });
});

$.end(function () {
    $('#led-r').turnOff();
});