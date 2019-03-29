/*!
 * Copyright (c) 2015-2017, Nanchao, Inc.
 * All rights reserved.
 */

/* globals uv: false */
'use strict';
var util = require('util');
var exceptionWithHostPort = require('util')._exceptionWithHostPort;

function udp() {
    this.sock = null; // jshint ignore:line
}

function wrapTryCatch(cb) {
    return function() {
        try {
            cb.apply(this, arguments);
        } catch (e) {
            return e;
        }
    };
}

udp.prototype.bind = wrapTryCatch(function(address, port) {
    this.sock = uv.new_udp(); // jshint ignore:line
    uv.udp_bind(this.sock, address, port); // jshint ignore:line
});

udp.prototype.recvStart = wrapTryCatch(function() {
    var self = this.owner;
    uv.udp_recv_start(this.sock, function(err, nread, data, rinfo) { // jshint ignore:line
        rinfo.size = data.length; // compatibility
        rinfo.address = rinfo.address;
        if (err || nread < 0) {
            self.emit('error', exceptionWithHostPort(err || new Error('nread < 0'), 'send', rinfo.address, rinfo.port));
        } else {
            self.emit('message', new Buffer(data), rinfo);
        }
    });
});

udp.prototype.recvStop = wrapTryCatch(function() {
    uv.udp_recv_stop(this.sock); // jshint ignore:line
});

udp.prototype.send = wrapTryCatch(function(data, offset, length, port, ip, callback) {
    var cb = function(err) {
        if (callback) {
            if (err) {
                err = exceptionWithHostPort(err, 'send', ip, port);
            }
            callback.call(null, err, length);
        }
    };

    var pkt = undefined;
    if (typeof data === 'string') {
        pkt = data.slice(offset, offset + length);
    } else if (data instanceof Buffer) {
        pkt = util._toNativeBuffer(data.slice(offset, offset + length));
    } else {
        throw new TypeError('Invalid udp data type');
    }
    uv.udp_send(this.sock, pkt, ip, port, cb); // jshint ignore:line
});

udp.prototype.getsockname = wrapTryCatch(function(options) {
    var sock = uv.udp_getsockname(this.sock); // jshint ignore:line
    options.family = sock.family;
    options.address = sock.address;
    options.port = sock.port;
});

udp.prototype.close = wrapTryCatch(function() {
    if (this.sock) {
        uv.close(this.sock);
    }
});

udp.prototype.setBroadcast = wrapTryCatch(function(flag) {
    uv.udp_setbroadcast(this.sock, flag);
});

exports.UDP = udp;
