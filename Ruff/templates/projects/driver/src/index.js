'use strict';

var driver = require('ruff-driver');

module.exports = driver({

    attach: function (inputs, context) {
        // this._<interface> = inputs['<interface>'];
    },

    exports: {
        func: function () {
            // this._<interface>.<method>
        }
    }

});
