'use strict';

var
	Packager = require('./lib/Packager');

/**
* Package an Enyo 2.6.x application based on the provided options.
*/
exports.package = function (opts) {
	return new Packager(opts);
};