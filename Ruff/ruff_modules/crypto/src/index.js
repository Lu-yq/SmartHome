'use strict';

var hash = require('./hash');
var Hmac = require('./hmac').Hmac;
var cipher = require('./cipher');
var pk = require('./public_key');

/* hash */
exports.createHash = exports.Hash = hash.Hash;
exports.getHashes = hash.getHashes;

/* hmac */
exports.createHmac = exports.Hmac = Hmac;

/* cipher */
exports.createCipher = exports.Cipher = cipher.Cipher;
exports.createCipheriv = exports.Cipheriv = cipher.Cipheriv;
exports.getCiphers = cipher.getCiphers;

/* decipher */
exports.createDecipher = exports.Decipher = cipher.Decipher;
exports.createDecipheriv = exports.Decipheriv = cipher.Decipheriv;

/* public key */
exports.privateDecrypt = pk.privateDecrypt;
exports.privateEncrypt = pk.privateEncrypt;
exports.publicDecrypt = pk.publicDecrypt;
exports.publicEncrypt = pk.publicEncrypt;
