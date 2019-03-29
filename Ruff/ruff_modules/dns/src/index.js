/*!
 * Copyright (c) 2015-2017, Nanchao, Inc.
 * All rights reserved.
 */

/*
 * Defaultly, we resolve domain through getaddrinfo from uv.
 * Once developer set a DNS server, we would parse it through send UDP packet to DNS server.
 */

'use strict';
var dns = require('./dns.js');

exports.lookup = dns.uvlookup;
exports.getServers = dns.getServers;
exports.setServers = function (servArray) {
    exports.lookup = dns.udplookup;
    dns.setServers(servArray);
};

exports.ADDRCONFIG = dns.ADDRCONFIG;
exports.V4MAPPED = dns.V4MAPPED;
