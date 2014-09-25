'use strict';
var logProvider = require('../lib');
var chai = require('chai');
var sinon = require('sinon');
var expect = require('chai').expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
describe(
    'base.logger', function () {
        describe(
            'configurations', function () {
                // it should not log anything when configured with an empty array
                it(
                    'should not log anything when configured with an empty array',
                    function () {
                        var logger = logProvider([]);
                        var origLogger = console.log;
                        var spyLogger = sinon.spy();
                        console.log = spyLogger;
                        logger.debug(1).info(1).warn(1).error(1);
                        console.log = origLogger;
                        expect(spyLogger).to.have.callCount(0);
                    }
                );
                // it should be able to configure properly with defaults
                it(
                    'should be able to configure properly with defaults',
                    function () {
                        var logger = logProvider();
                        var origLogger = console.log;
                        var spyLogger = sinon.spy();
                        console.log = spyLogger;
                        logger.debug(1).info(1).warn(1).error(1);
                        console.log = origLogger;
                        expect(spyLogger).to.have.callCount(4);
                    }
                );
                // it should be able to configure properly with array
                it(
                    'should be able to configure properly with array',
                    function () {
                        var logger = logProvider(
                            [
                                {
                                    match: 'alpha',
                                    appender: 'console',
                                    level: 'info'
                                }
                            ]
                        );
                        var origLogger = console.log;
                        var spyLogger = sinon.spy();
                        console.log = spyLogger;
                        logger.debug(1).info(1).warn(1).error(1);
                        logger = logger.group('alpha');
                        logger.debug(1).info(1).warn(1).error(1);
                        console.log = origLogger;
                        expect(spyLogger).to.have.callCount(3);
                    }
                );
                // it should be able to configure properly with object
                it(
                    'should be able to configure properly with object',
                    function () {
                        var logger = logProvider(
                            {
                                settings: [
                                    {
                                        match: 'alpha',
                                        appender: 'console',
                                        level: 'info'
                                    }
                                ],
                                group: 'alpha'
                            }
                        );
                        var origLogger = console.log;
                        var spyLogger = sinon.spy();
                        console.log = spyLogger;
                        logger.debug(1).info(1).warn(1).error(1);
                        logger = logger.group('beta');
                        logger.debug(1).info(1).warn(1).error(1);
                        console.log = origLogger;
                        expect(spyLogger).to.have.callCount(6);
                    }
                );
                // it should be able to configure properly with string
                it(
                    'should be able to configure properly with string',
                    function () {
                        var logger = logProvider('alpha');
                        var origLogger = console.log;
                        var spyLogger = sinon.spy();
                        console.log = spyLogger;
                        logger.debug(1).info(1).warn(1).error(1);
                        logger = logger.group('beta');
                        logger.debug(1).info(1).warn(1).error(1);
                        console.log = origLogger;
                        expect(spyLogger).to.have.callCount(8);
                    }
                );
                // should be able to stop and start itself
                it(
                    'should be able to stop and start itself',
                    function () {
                        var logger = logProvider(
                            {
                                settings: [
                                    {
                                        match: 'alpha',
                                        appender: 'console',
                                        level: 'info'
                                    }
                                ],
                                group: 'alpha'
                            }
                        );
                        var origLogger = console.log;
                        var spyLogger = sinon.spy();
                        console.log = spyLogger;
                        logger.stop();
                        logger.debug(1).info(1).warn(1).error(1);
                        logger = logger.group('beta');
                        logger.start();
                        logger.debug(1).info(1).warn(1).error(1);
                        console.log = origLogger;
                        expect(spyLogger).to.have.callCount(3);
                    }
                );
            }
        );
    }
);