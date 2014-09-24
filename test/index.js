'use strict';
var logProvider = require('../lib'),
    chai = require('chai'),
    sinon = require('sinon'),
    expect = require('chai').expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
describe('base.logger', function () {
    // it should return a module
    it('should return a module', function () {
        expect(logProvider).not.to.equal(undefined);
    });
    // it should not log anything when configured with an empty array
    it('should not log anything when configured with an empty array', function () {
        var logger = logProvider({
            group: 'G1',
            settings: []
        });
        var origLogger = console.log;
        var spyLogger = sinon.spy();
        console.log = spyLogger;
        logger.debug(1).info(1).warn(1).error(1);
        console.log = origLogger;
        expect(spyLogger).to.have.callCount(0);
    });
    // it should be able to configure properly with defaults
    it('should be able to configure properly with defaults', function () {
        var logger = logProvider({
            group: 'G1'
        });
        var origLogger = console.log;
        var spyLogger = sinon.spy(function () {
            origLogger.apply(console, arguments);
        });
        console.log = spyLogger;
        logger.debug(1).info(1).warn(1).error(1);
        console.log = origLogger;
        expect(spyLogger).to.have.callCount(4);
    });
});
