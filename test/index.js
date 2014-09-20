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
        logProvider.configure([]);
        var origLogger = console.log, spyLogger = sinon.spy();
        console.log = spyLogger;
        var logger = logProvider('');
        logger.log(1);
        logger.info(1);
        logger.error(1);
        logger.warn(1);
        console.log = origLogger;
        expect(spyLogger).to.have.callCount(0);
    });
    // it should respect patterns
    it('should respect patterns (test 1)', function () {
        var origLogger = console.log,
            spyLogger = sinon.spy();
        // first test
        console.log = spyLogger;
        logProvider.configure([{
            pattern: '.*',
            level: 'log'
        }]);
        var logger = logProvider('hello');
        logger.log(1);
        logger.info(1);
        logger.error(1);
        logger.warn(1);
        console.log = origLogger;
        expect(spyLogger).to.have.callCount(4);
    });
    it('should respect patterns (test 2)', function () {
        var origLogger = console.log,
            spyLogger = sinon.spy();
        // second test
        console.log = spyLogger;
        logProvider.configure([{
            pattern: 'invalid',
            level: 'log'
        }]);
        var logger = logProvider('hello');
        logger.log(1);
        logger.info(1);
        logger.error(1);
        logger.warn(1);
        console.log = origLogger;
        expect(spyLogger).to.have.callCount(0);
    });
    it('should respect patterns (test 3)', function () {
        var origLogger = console.log,
            spyLogger = sinon.spy();
        // third test
        console.log = spyLogger;
        logProvider.configure([{
            pattern: /^[a-z]*$/,
            level: 'log'
        }]);
        var logger = logProvider('hello');
        logger.log(1);
        logger.info(1);
        logger.error(1);
        logger.warn(1);
        logger = logProvider('hEllo');
        logger.log(1);
        logger.info(1);
        logger.error(1);
        logger.warn(1);
        console.log = origLogger;
        expect(spyLogger).to.have.callCount(4);
    });
    // it should respect log levels
    it('should respect log levels (test 1)', function () {
        var origLogger = console.log,
            spyLogger = sinon.spy();
        // first test
        console.log = spyLogger;
        logProvider.configure([{
            pattern: '.*',
            level: 'error'
        }]);
        var logger = logProvider('hello');
        logger.log(1);
        logger.info(1);
        logger.error(1);
        logger.warn(1);
        console.log = origLogger;
        expect(spyLogger).to.have.callCount(1);
    });
    it('should respect log levels (test 2)', function () {
        var origLogger = console.log,
            spyLogger = sinon.spy();
        // second test
        console.log = spyLogger;
        logProvider.configure([{
            pattern: '.*',
            level: 'none'
        }]);
        var logger = logProvider('hello');
        logger.log(1);
        logger.info(1);
        logger.error(1);
        logger.warn(1);
        console.log = origLogger;
        expect(spyLogger).to.have.callCount(0);
    });
    it('should respect log levels (test 2)', function () {
        var origLogger = console.log,
            spyLogger = sinon.spy();
        // third test
        spyLogger = sinon.spy();
        console.log = spyLogger;
        logProvider.configure([{
            pattern: '.*',
            level: 'info'
        }]);
        var logger = logProvider('hello');
        logger.log(1);
        logger.info(1);
        logger.error(1);
        logger.warn(1);
        logger = logProvider('hEllo');
        logger.log(1);
        logger.info(1);
        logger.error(1);
        logger.warn(1);
        console.log = origLogger;
        expect(spyLogger).to.have.callCount(6);
    });
    // it should be able to log objects
    it('should be able to log objects', function () {
        var origLogger = console.log,
            spyLogger = sinon.spy();
        // first test
        console.log = spyLogger;
        logProvider.configure();
        var logger = logProvider();
        logger.log({
            hello: 'world'
        });
        logger.info([1, 2, 3, 4]);
        expect(spyLogger).to.have.callCount(2);
        console.log = origLogger;
    });
    // should format newlines properly
    it('should format newlines properly', function () {
        var origLogger = console.log,
            spyLogger = sinon.spy();
        // first test
        console.log = spyLogger;
        logProvider.configure();
        var logger = logProvider();
        logger.log('hello\nworld');
        expect(spyLogger).to.have.callCount(1);
        console.log = origLogger;
    });
    // should log empty lines
    it('should log empty lines', function () {
        var origLogger = console.log,
            spyLogger = sinon.spy();
        // first test
        console.log = spyLogger;
        logProvider.configure();
        var logger = logProvider();
        logger.log();
        expect(spyLogger).to.have.callCount(1);
        console.log = origLogger;
    });
    // should not log with no-op appender
    it('should not log with no-op appender', function () {
        var origLogger = console.log,
            spyLogger = sinon.spy();
        // first test
        console.log = spyLogger;
        logProvider.configure([{
            pattern: '.*',
            appender: 'no-op'
        }]);
        var logger = logProvider();
        logger.log(1);
        logger.info(1);
        logger.error(1);
        logger.warn(1);
        expect(spyLogger).to.have.callCount(0);
        console.log = origLogger;
    });
    // should not configure with invalid appenders
    it('should fail silently invalid appenders', function () {
        var origLogger = console.log,
            spyLogger = sinon.spy();
        // first test
        console.log = spyLogger;
        logProvider.configure([{
            pattern: '.*',
            appender: 'invalid-appender'
        }]);
        var logger = logProvider();
        logger.log(1);
        logger.info(1);
        logger.error(1);
        logger.warn(1);
        expect(spyLogger).to.have.callCount(0);
        console.log = origLogger;
    });
    // should not configure with invalid appenders
    it('should fail silently invalid levels', function () {
        var origLogger = console.log,
            spyLogger = sinon.spy();
        // first test
        console.log = spyLogger;
        logProvider.configure([{
            level: 'invalid log level'
        }]);
        var logger = logProvider();
        logger.log(1);
        logger.info(1);
        logger.error(1);
        logger.warn(1);
        expect(spyLogger).to.have.callCount(4);
        console.log = origLogger;
    });
});
