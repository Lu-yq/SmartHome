'use strict';

exports.toBuf = toBuf;
function toBuf(str, encoding) {
    if (typeof str === 'string') {
        if (encoding === 'buffer' || !encoding) {
            encoding = 'utf8';
        }
        return Buffer.from(str, encoding);
    }
    return str;
}

exports.Shaping = Shaping;
function Shaping(size) {
    this._blockSize = size;
    this._buffer = new Buffer(0);
}

Shaping.prototype.update = function(data) {
    if (this._blockSize === 1) {
        return data;
    }

    var res;
    var buffer;

    /* rebuild buffer */
    if (this._buffer.length > 0) {
        buffer = Buffer.concat([this._buffer, data])
    } else {
        buffer = data;
    }

    /* split data and residue */
    var residue;
    if (buffer.length < this._blockSize) {
        res = new Buffer(0);
        residue = buffer;
    } else {
        var residueSize = buffer.length % this._blockSize;

        if (residueSize) {
            residue = buffer.slice(buffer.length - residueSize, buffer.length);
            buffer = buffer.slice(0, buffer.length - residueSize);
        } else {
            residue = new Buffer(0);
        }

        res = buffer;
    }

    /* store residue */
    this._buffer = residue;

    return res;
};

Shaping.prototype.final = function() {
    return this._buffer;
}
