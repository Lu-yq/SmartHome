'use strict';

var stream = require('stream');
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

var Hash = require('./hash').Hash;

var CipherTypeMap = {
    'aes128': {
        type: binding['cipher-aes-128-cbc'],
        blockSize: 16,
        keyLength: 16,
        ivLength: 16
    },
    'aes-128-cbc': {
        type: binding['cipher-aes-128-cbc'],
        blockSize: 16,
        keyLength: 16,
        ivLength: 16
    },
    'aes192': {
        type: binding['cipher-aes-192-cbc'],
        blockSize: 16,
        keyLength: 24,
        ivLength: 16
    },
    'aes-192-cbc': {
        type: binding['cipher-aes-192-cbc'],
        blockSize: 16,
        keyLength: 24,
        ivLength: 16
    },
    'aes256': {
        type: binding['cipher-aes-256-cbc'],
        blockSize: 16,
        keyLength: 32,
        ivLength: 16
    },
    'aes-256-cbc': {
        type: binding['cipher-aes-256-cbc'],
        blockSize: 16,
        keyLength: 32,
        ivLength: 16
    },
    'aes-128-ecb': {
        type: binding['cipher-aes-128-ecb'],
        blockSize: 16,
        keyLength: 16,
        ivLength: 0
    },
    'aes-192-ecb': {
        type: binding['cipher-aes-192-ecb'],
        blockSize: 16,
        keyLength: 24,
        ivLength: 0
    },
    'aes-256-ecb': {
        type: binding['cipher-aes-256-ecb'],
        blockSize: 16,
        keyLength: 32,
        ivLength: 0
    }
};

function md5(data, inputEncoding) {
    var hash = new Hash('md5');

    hash.update(data, inputEncoding);

    return hash.digest();
}

function genKeyAndIv(password, algorithm) {
    var info = CipherTypeMap[algorithm];
    if (!info) {
        throw new Error('Unkonw cipher type');
    }

    var keyLength = info.keyLength;
    var ivLength = info.ivLength;
    var md5Cnt = parseInt((keyLength + ivLength - 1 ) / 16) + 1;

    var md5s = [md5(password)];
    for (var i = 1; i < md5Cnt; i++) {
        md5s.push(md5(Buffer.concat([md5s[md5s.length - 1], Buffer.from(password)])));
    }

    var buffer = Buffer.concat(md5s);

    var key = buffer.slice(0, keyLength);
    var iv = buffer.slice(keyLength, keyLength + ivLength);

    return {
        key: key,
        iv: iv
    };
}

exports.Cipheriv = Cipheriv;
function Cipheriv(algorithm, key, iv, options) {
    if (!(this instanceof Cipheriv)) {
        return new Cipheriv(algorithm, key, iv, options);
    }

    stream.Transform.call(this, options);

    var type = CipherTypeMap[algorithm];
    if (type === undefined) {
        throw new Error('Unknown cipher');
    }

    this._handle = binding.cipher_init(CipherTypeMap[algorithm].type, tools.toBuf(key), tools.toBuf(iv), true);
    this._autoPadding = true;
    this._blockSize = CipherTypeMap[algorithm].blockSize;
    this._shaping = new tools.Shaping(this._blockSize);
}

util.inherits(Cipheriv, stream.Transform);

Cipheriv.prototype.setAutoPadding = function(autoPadding) {
    this._autoPadding = autoPadding === undefined ? true : autoPadding;

    return this;
}

Cipheriv.prototype.update = function(data, inputEncoding, outputEncoding) {
    var plaintext = this._shaping.update(tools.toBuf(data, inputEncoding));
    var ciphertext = plaintext;

    if (plaintext.length > 0) { /* encrypt plaintest */
        ciphertext = binding.cipher_encrypt(this._handle, plaintext);
        ciphertext = Buffer.from(ciphertext);
    }

    return outputEncoding ? ciphertext.toString(outputEncoding) : ciphertext;
}

Cipheriv.prototype.final = function(outputEncoding) {
    var plaintext = this._shaping.final();

    var ciphertext = plaintext;
    if (this._autoPadding) {
        var paddingSize = this._blockSize - plaintext.length;
        var paddingBuffer = Buffer.alloc(paddingSize, paddingSize);

        var buffer = Buffer.concat([plaintext, paddingBuffer]);
        ciphertext = binding.cipher_encrypt(this._handle, buffer);
        ciphertext = Buffer.from(ciphertext);
    } else {
        if (plaintext.length !== 0) {
            throw new Error('Invalid plaintext length');
        }
    }

    return outputEncoding ? ciphertext.toString(outputEncoding) : ciphertext;
}

Cipheriv.prototype._transform = function(chunk, encoding, callback) {
    var cipherText = this.update(chunk, encoding);

    this.push(cipherText);

    callback();
}

Cipheriv.prototype._flush = function(callback) {
    var cipherText = this.final();

    this.push(cipherText);

    callback();
};

exports.Cipher = Cipher;
function Cipher(algorithm, password, options) {
    if (!(this instanceof Cipher)) {
        return new Cipher(algorithm, password, options);
    }

    /* generate key and iv */
    var info = genKeyAndIv(password, algorithm);

    Cipheriv.call(this, algorithm, info.key, info.iv, options);
}

util.inherits(Cipher, Cipheriv);

exports.Decipheriv = Decipheriv;
function Decipheriv(algorithm, key, iv, options) {
    if (!(this instanceof Decipheriv)) {
        return new Decipheriv(algorithm, key, iv, options);
    }

    stream.Transform.call(this, options);

    var type = CipherTypeMap[algorithm];
    if (type === undefined) {
        throw new Error('Unknown cipher');
    }

    this._handle = binding.cipher_init(CipherTypeMap[algorithm].type, tools.toBuf(key), tools.toBuf(iv), false);
    this._autoPadding = true;
    this._blockSize = CipherTypeMap[algorithm].blockSize;
    this._shaping = new tools.Shaping(this._blockSize);
    this._buffer = new Buffer(0);
}

util.inherits(Decipheriv, stream.Transform);

Decipheriv.prototype.setAutoPadding = function(autoPadding) {
    this._autoPadding = autoPadding === undefined ? true : autoPadding;

    return this;
}

Decipheriv.prototype.update = function(data, inputEncoding, outputEncoding) {
    var ciphertext = this._shaping.update(tools.toBuf(data, inputEncoding));
    var plaintext = ciphertext;

    if (ciphertext.length > 0) { /* decrypt ciphertext */
        plaintext = binding.cipher_decrypt(this._handle, ciphertext);

        /* take out last ${this._blockSize} bytes */
        plaintext = Buffer.concat([this._buffer, plaintext]);
        this._buffer = plaintext.slice(plaintext.length - this._blockSize, plaintext.length);
        plaintext = plaintext.slice(0, plaintext.length - this._blockSize);
    }

    return outputEncoding ? plaintext.toString(outputEncoding) : plaintext;
};

Decipheriv.prototype.final = function(outputEncoding) {
    var ciphertext = this._shaping.final();

    if (ciphertext.length > 0) {
        throw new Error('Invalid ciphertext length');
    }

    if (this._buffer.length !== this._blockSize) {
        throw new Error('No data decrypted');
    }

    /* remove padding */
    var plaintext = this._buffer;
    if (this._autoPadding) {
        var paddingSize = this._buffer[this._buffer.length - 1];
        plaintext = this._buffer.slice(0, this._buffer.length - paddingSize);
    }

    return outputEncoding ? plaintext.toString(outputEncoding) : plaintext;
};

Decipheriv.prototype._transform = function(chunk, encoding, callback) {
    var plaintext = this.update(chunk, encoding);

    this.push(plaintext);

    callback();
};

Decipheriv.prototype._flush = function(callback) {
    var plaintext = this.final();

    this.push(plaintext);

    callback();
};

exports.Decipher = Decipher;
function Decipher(algorithm, password, options) {
    if (!(this instanceof Decipher)) {
        return new Decipher(algorithm, password, options);
    }

    /* generate key and iv */
    var info = genKeyAndIv(password, algorithm);

    Decipheriv.call(this, algorithm, info.key, info.iv, options);
}

util.inherits(Decipher, Decipheriv);

exports.getCiphers = function () {
    return [
        'aes-128-cbc',
        'aes-128-ecb',
        'aes-192-cbc',
        'aes-192-ecb',
        'aes-256-cbc',
        'aes-256-ecb'
    ];
}
