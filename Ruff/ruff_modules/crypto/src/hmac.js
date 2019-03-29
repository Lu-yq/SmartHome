'use strict';

var stream = require('stream');
var util = require('util');

// TODO: This is a workaround for auto-test.
// A better way is that gulp copies crypto.so from build/crypto/ to src/
var path = require('path');
var fs = require('fs');
var cryptoPath = path.join(__dirname, '../../build/crypto/crypto.so');
var binding;
if (fs.existsSync(cryptoPath)) {
    binding = require(cryptoPath);
} else {
    binding = require('./crypto.so');
}

var HmacBindings = {
    md5: binding.hmac_md5,
    sha1: binding.hmac_sha1,
    sha224: binding.hmac_sha224,
    sha256: binding.hmac_sha256,
    sha384: binding.hmac_sha384,
    sha512: binding.hmac_sha512
};

function Hmac(algorithm, key, options) {
    if (!(this instanceof Hmac)) {
        return new Hmac(algorithm, key, options);
    }

    stream.Transform.call(this, options);

    this.algorithm = algorithm;
    this.buffers = [];
    this.keyBuffer = Buffer.from(key);
}

util.inherits(Hmac, stream.Transform);

Hmac.prototype.update = function(data, input_encoding) {
    this.buffers.push(Buffer.from(data, input_encoding));

    return this;
};

Hmac.prototype.digest = function(encoding) {
    var buffer = Buffer.concat(this.buffers)
    var output = HmacBindings[this.algorithm](buffer, this.keyBuffer);

    if (encoding) {
        return Buffer.from(output).toString(encoding);
    }

    return Buffer.from(output);
};

Hmac.prototype._transform = function(chunk, encoding, callback) {
    this.update(chunk, encoding);

    callback();
};

Hmac.prototype._flush = function(callback) {
    this.push(this.digest());

    callback();
};

exports.Hmac = Hmac;
