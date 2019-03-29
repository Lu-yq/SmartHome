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

var HashBindings = {
    md5: binding.hash_md5,
    sha1: binding.hash_sha1,
    sha224: binding.hash_sha224,
    sha256: binding.hash_sha256,
    sha384: binding.hash_sha384,
    sha512: binding.hash_sha512
};

function Hash(algorithm, options) {
    if (!(this instanceof Hash)) {
        return new Hash(algorithm, options);
    }

    stream.Transform.call(this, options);

    this.algorithm = algorithm;
    this.buffers = [];
}

util.inherits(Hash, stream.Transform);

Hash.prototype.update = function(data, input_encoding) {
    this.buffers.push(Buffer.from(data, input_encoding));

    return this;
};

Hash.prototype.digest = function(encoding) {
    var buffer = Buffer.concat(this.buffers)
    var output = HashBindings[this.algorithm](buffer);

    if (encoding) {
        return Buffer.from(output).toString(encoding);
    }

    return Buffer.from(output);
};

Hash.prototype._transform = function(chunk, encoding, callback) {
    this.update(chunk, encoding);

    callback();
};

Hash.prototype._flush = function(callback) {
    this.push(this.digest());

    callback();
};

exports.Hash = Hash;

exports.getHashes = function () {
    return [
        'md5',
        'sha1',
        'sha224',
        'sha256',
        'sha384',
        'sha512'
    ];
}
