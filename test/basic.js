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
            'basic functionalities', function () {
                // it should return a module
                it(
                    'should return a module',
                    function () {
                        expect(logProvider).not.to.equal(undefined);
                    }
                );
                it(
                    'should be able to log objects',
                    function () {
                        var logger = logProvider(
                            [
                                {
                                    pattern: '%m'
                                }
                            ]
                        );
                        var origLogger = console.log;
                        var spyLogger = sinon.spy();
                        console.log = spyLogger;
                        logger.debug('value', {a: 1, b: 2});
                        console.log = origLogger;
                        expect(spyLogger).to.have.callCount(1);
                        expect(spyLogger.getCall(0)).to.have.been.calledWithExactly('value { a: 1, b: 2 }');
                    }
                );
            }
        );
    }
);

