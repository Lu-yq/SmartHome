'use strcit';

var util = require('util');
var tools = require('./tools');

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

exports.privateDecrypt = function(private_key, buffer) {
    return binding.pk_private_decrypt(private_key, buffer);
};

exports.privateEncrypt = function(private_key, buffer) {
    return binding.pk_private_encrypt(private_key, buffer);
};

exports.publicDecrypt = function(public_key, buffer) {
    return binding.pk_public_decrypt(public_key, buffer);
};

exports.publicEncrypt = function(public_key, buffer) {
    if (!(buffer instanceof Buffer)) {
        buffer = Buffer.from(buffer);
    }

    var res = binding.pk_public_encrypt(public_key, util._toNativeBuffer(buffer));

    return Buffer.from(res);
};
