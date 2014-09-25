'use strict';
var logProvider = require('../lib');
var chai = require('chai');
var sinon = require('sinon');
var expect = require('chai').expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
require('colors');
describe(
    'base.logger', function () {
        describe(
            'formatter', function () {
                // it should be able to format log messages properly (test 1)
                it(
                    'should be able to format log messages properly (test 1)',
                    function () {
                        var logger = logProvider([{
                            pattern: '%10.10g | [%-1.1l] %m'
                        }]);
                        var origLogger = console.log;
                        var spyLogger = sinon.spy();
                        console.log = spyLogger;
                        logger = logger.group('alpha');
                        logger.debug(1).info(1).warn(1).error(1);
                        logger = logger.group('romeo');
                        logger.debug(1).info(1).warn(1).error(1);
                        console.log = origLogger;
                        expect(spyLogger).to.have.callCount(8);
                        expect(spyLogger.getCall(0)).to.have.been.calledWithExactly('    /alpha | [d] 1'.italic.grey);
                        expect(spyLogger.getCall(1)).to.have.been.calledWithExactly('    /alpha | [i] 1'.green);
                        expect(spyLogger.getCall(2)).to.have.been.calledWithExactly('    /alpha | [w] 1'.yellow);
                        expect(spyLogger.getCall(3)).to.have.been.calledWithExactly('    /alpha | [e] 1'.bold.red);
                        expect(spyLogger.getCall(4)).to.have.been.calledWithExactly('lpha/romeo | [d] 1'.italic.grey);
                        expect(spyLogger.getCall(5)).to.have.been.calledWithExactly('lpha/romeo | [i] 1'.green);
                        expect(spyLogger.getCall(6)).to.have.been.calledWithExactly('lpha/romeo | [w] 1'.yellow);
                        expect(spyLogger.getCall(7)).to.have.been.calledWithExactly('lpha/romeo | [e] 1'.bold.red);
                    }
                );
                // it should be able to format log messages properly (test 2)
                it(
                    'should be able to format log messages properly (test 2)',
                    function () {
                        var logger = logProvider([{
                            pattern: '%-10.10g | [%4l] %m'
                        }]);
                        var origLogger = console.log;
                        var spyLogger = sinon.spy();
                        console.log = spyLogger;
                        logger = logger.group('alpha');
                        logger.debug(1).info(1).warn(1).error(1);
                        logger = logger.group('romeo');
                        logger.debug(1).info(1).warn(1).error(1);
                        console.log = origLogger;
                        expect(spyLogger).to.have.callCount(8);
                        expect(spyLogger.getCall(0)).to.have.been.calledWithExactly(
                            '/alpha     | [debug] 1'.italic.grey
                        );
                        expect(spyLogger.getCall(1)).to.have.been.calledWithExactly('/alpha     | [info] 1'.green);
                        expect(spyLogger.getCall(2)).to.have.been.calledWithExactly('/alpha     | [warn] 1'.yellow);
                        expect(spyLogger.getCall(3)).to.have.been.calledWithExactly('/alpha     | [error] 1'.bold.red);
                        expect(spyLogger.getCall(4)).to.have.been.calledWithExactly(
                            '/alpha/rom | [debug] 1'.italic.grey
                        );
                        expect(spyLogger.getCall(5)).to.have.been.calledWithExactly('/alpha/rom | [info] 1'.green);
                        expect(spyLogger.getCall(6)).to.have.been.calledWithExactly('/alpha/rom | [warn] 1'.yellow);
                        expect(spyLogger.getCall(7)).to.have.been.calledWithExactly('/alpha/rom | [error] 1'.bold.red);
                    }
                );
            }
        );
    }
);