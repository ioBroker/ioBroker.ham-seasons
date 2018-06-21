/* jshint -W097 */
/* jshint strict: false */
/* jslint node: true */
/* jslint esversion: 6 */
'use strict';

//const utils   = require(__dirname + '/lib/utils'); // Get common adapter utils
const IOB_HB = require(require.resolve('iobroker.ham'));
const pack = require('./io-package.json');
IOB_HB({
    name: pack.common.name,
    exitAfter: 10000
});
