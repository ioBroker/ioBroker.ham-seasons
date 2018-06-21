/* jshint -W097 */
/* jshint strict: false */
/* jslint node: true */
/* jslint esversion: 6 */
'use strict';

//const utils   = require(__dirname + '/lib/utils'); // Get common adapter utils
const IOB_HB = require(require.resolve('iobroker.ham'));
const pack = require('./io-package.json');
IOB_HB(pack.common.name);

// To end if scheduled
//const adapter = new utils.Adapter(pack.common.name);
//setTimeout(() => adapter && adapter.stop(), 10000);
