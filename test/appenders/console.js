'use strict';
var logProvider = require('../../lib');
var chai = require('chai');
var sinon = require('sinon');
var expect = require('chai').expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
describe(
    'base.logger', function () {
        describe(
            'console appender', function () {
                it(
                    'should be able to log messages onto console',
                    function () {
                        var logger = logProvider(
                            [
                                {
                                    pattern: '%l %m'
                                }
                            ]
                        );
                        var origLogger = console.log;
                        var spyLogger = sinon.spy();
                        console.log = spyLogger;
                        logger.debug('value', {a: 1, b: 2});
                        logger.info('value', {a: 1, b: 2});
                        logger.warn('value', {a: 1, b: 2});
                        logger.error('value', {a: 1, b: 2});
                        console.log = origLogger;
                        expect(spyLogger).to.have.callCount(4);
                        expect(spyLogger.getCall(0)).to.have.been.calledWithExactly('debug value { a: 1, b: 2 }');
                        expect(spyLogger.getCall(1)).to.have.been.calledWithExactly('info value { a: 1, b: 2 }');
                        expect(spyLogger.getCall(2)).to.have.been.calledWithExactly('warn value { a: 1, b: 2 }');
                        expect(spyLogger.getCall(3)).to.have.been.calledWithExactly('error value { a: 1, b: 2 }');
                    }
                );
            }
        );
    }
);

