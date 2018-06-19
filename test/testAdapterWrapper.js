/* jshint -W097 */// jshint strict:false
/*jslint node: true */
'use strict';
const expect = require('chai').expect;
const setup  = require(__dirname + '/lib/setup');
const request = require('request');
const http = require('http');
const defConfig = require('../io-package');

let objects = null;
let states  = null;
let onStateChanged = null;
let onObjectChanged = null;
let sendToID = 1;

const adapterShortName = setup.adapterName.substring(setup.adapterName.indexOf('.') + 1);

let httpServer;
let lastHTTPRequest = null;

function setupHTTPServer(port, callback) {
    httpServer = http.createServer((req, res) => {
        lastHTTPRequest = req.url;
        console.log('HTTP Received: ' + lastHTTPRequest);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('OK');
    }).listen(port);
    setTimeout(() => callback(), 5000);
}

function checkConnectionOfAdapter(cb, counter) {
    counter = counter || 0;
    console.log('Try check #' + counter);
    if (counter > 30) {
        if (cb) cb('Cannot check connection');
        return;
    }

    states.getState('system.adapter.' + adapterShortName + '.0.alive', (err, state) => {
        if (err) console.error(err);
        if (state && state.val) {
            if (cb) cb();
        } else {
            setTimeout(() => checkConnectionOfAdapter(cb, counter + 1), 1000);
        }
    });
}

function checkValueOfState(id, value, cb, counter) {
    counter = counter || 0;
    if (counter > 20) {
        if (cb) cb('Cannot check value Of State ' + id);
        return;
    }

    states.getState(id, (err, state) => {
        if (err) console.error(err);
        if (value === null && !state) {
            if (cb) cb();
        } else
        if (state && (value === undefined || state.val === value)) {
            if (cb) cb();
        } else {
            setTimeout(() => checkValueOfState(id, value, cb, counter + 1), 500);
        }
    });
}

function sendTo(target, command, message, callback) {
    onStateChanged = (id, state) => (id === 'messagebox.system.adapter.test.0') && callback(state.message);

    states.pushMessage('system.adapter.' + target, {
        command:    command,
        message:    message,
        from:       'system.adapter.test.0',
        callback: {
            message: message,
            id:      sendToID++,
            ack:     false,
            time:    (new Date()).getTime()
        }
    });
}

describe('Test ' + adapterShortName + ' Wrapper adapter', () => {
    before('Test ' + adapterShortName + ' Wrapper adapter: Start js-controller', function (_done) {
        this.timeout(600000); // because of first install from npm

        setup.setupController(() => {
            const config = setup.getAdapterConfig();
            // enable adapter
            config.common.enabled  = true;
            config.common.loglevel = 'debug';

            config.native = defConfig.native;

            setup.setAdapterConfig(config.common, config.native);

            setupHTTPServer(9080, () => {
                setup.startController(true,
                    (id, obj) => {},
                    (id, state) => onStateChanged && onStateChanged(id, state),
                    (_objects, _states) => {
                        objects = _objects;
                        states  = _states;
                        _done();
                    });
            });
        });
    });

    it('Test ' + adapterShortName + ' Wrapper adapter: Check if adapter started', done => {
        this;
        checkConnectionOfAdapter(res => {
            if (res) console.log(res);
            expect(res).not.to.be.equal('Cannot check connection');
            objects.setObject('system.adapter.test.0', {
                    common: {

                    },
                    type: 'instance'
                },
                () => {
                    states.subscribeMessage('system.adapter.test.0');
                    done();
                });
        });
    }).timeout(60000);

    it('Test ' + adapterShortName + ' Wrapper adapter: Wait for npm installs', done => {
        setTimeout(() => done(), 30000);
    }).timeout(60000);

    it('Test ' + adapterShortName + ' Wrapper: Verify Init', done => {
        states.getState(adapterShortName + '.0.Switch-name-1.Switch-name-1.On', function (err, state) {
            expect(err).to.not.exist;
            expect(state.val).to.be.false;

            states.getState(adapterShortName + '.0.Sun.Accessory-Information.Model', function (err, state) {
                expect(err).to.not.exist;
                expect(state.val).to.be.equal('Sun Position');

                states.getState(adapterShortName + '.0.Sun.Sun.Altitude', function (err, state) {
                    expect(err).to.not.exist;
                    expect(state.val).to.exist;
                    done();
                });
            });
        });
    }).timeout(10000);

    it('Test ' + adapterShortName + ' Wrapper: Test Change from inside', done => {
        request('http://localhost:61828/?accessoryId=switch1&state=true', (error, response, body) => {
            expect(error).to.be.null;
            expect(response && response.statusCode).to.be.equal(200);

            setTimeout(function() {
                expect(lastHTTPRequest).to.be.null;
                states.getState(adapterShortName + '.0.Switch-name-1.Switch-name-1.On', (err, state) => {
                    expect(err).to.not.exist;
                    expect(state.val).to.be.true;
                    done();
                });
            }, 2000);
        });

    }).timeout(10000);

    it('Test ' + adapterShortName + ' Wrapper: Test change via characteristic', done => {
        states.setState(adapterShortName + '.0.Switch-name-1.Switch-name-1.On', {val: false, ack: false}, err => {
            expect(err).to.not.exist;

            setTimeout(() => {
                expect(lastHTTPRequest).to.be.equal('/switch1?off');
                states.getState(adapterShortName + '.0.Switch-name-1.Switch-name-1.On', (err, state) => {
                    expect(err).to.not.exist;
                    expect(state.val).to.be.false;
                    done();
                });
            }, 2000);
        });
    }).timeout(10000);

    it('Test ' + adapterShortName + ' Wrapper: Test change via characteristic 2', done => {
        states.setState(adapterShortName + '.0.Switch-name-1.Switch-name-1.On', {val: true, ack: false}, err => {
            expect(err).to.not.exist;

            setTimeout(() => {
                expect(lastHTTPRequest).to.be.equal('/switch1?on');
                states.getState(adapterShortName + '.0.Switch-name-1.Switch-name-1.On', (err, state) => {
                    expect(err).to.not.exist;
                    expect(state.val).to.be.true;
                    done();
                });
            }, 2000);
        });
    }).timeout(10000);

    it('Test ' + adapterShortName + ' Wrapper: Test Change from inside 2', done => {
        lastHTTPRequest = null;
        request('http://localhost:61828/?accessoryId=switch1&state=false', (error, response, body) => {
            expect(error).to.be.null;
            expect(response && response.statusCode).to.be.equal(200);

            setTimeout(function() {
                expect(lastHTTPRequest).to.be.null;
                states.getState(adapterShortName + '.0.Switch-name-1.Switch-name-1.On', (err, state) => {
                    expect(err).to.not.exist;
                    expect(state.val).to.be.false;
                    done();
                });
            }, 2000);
        });
    }).timeout(10000);

    after('Test ' + adapterShortName + ' Wrapper adapter: Stop js-controller', function (done) {
        this.timeout(10000);

        setup.stopController(function (normalTerminated) {
            console.log('Adapter normal terminated: ' + normalTerminated);
            httpServer.close();
            done();
        });
    });
});
