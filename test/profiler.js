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
            'profiler', function () {
                // it should be able to profile functions properly
                it(
                    'should be able to profile functions properly', function () {
                        var logger = logProvider();
                        var noOp = function noOp () {
                            return;
                        };
                        var profiler = {
                            a: noOp,
                            b: noOp,
                            c: 1
                        };
                        var origLogger = console.log;
                        var spyLogger = sinon.spy();
                        logger.profile(profiler);
                        console.log = spyLogger;
                        profiler.a();
                        profiler.b();
                        profiler.a();
                        console.log = origLogger;
                        expect(profiler.c).to.eql(1);
                        expect(spyLogger).to.have.callCount(3);
                    }
                );
                // it should be able to do a verbose profiling
                it(
                    'should be able to do a verbose profiling', function () {
                        var logger = logProvider();
                        var noOp = function noOp () {
                            return 22;
                        };
                        var profiler = {
                            a: noOp,
                            b: noOp,
                            c: 1
                        };
                        var origLogger = console.log;
                        var spyLogger = sinon.spy();
                        logger.profile(profiler, true);
                        console.log = spyLogger;
                        profiler.a(2, 3, 4);
                        profiler.b();
                        profiler.a();
                        console.log = origLogger;
                        expect(profiler.c).to.eql(1);
                        expect(spyLogger).to.have.callCount(3);
                    }
                );
            }
        );
    }
);