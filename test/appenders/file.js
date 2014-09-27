'use strict';
var logProvider = require('../../lib');
var moment = require('moment');
var chai = require('chai');
var fs = require('fs-extra');
var expect = require('chai').expect;
chai.use(require('chai-as-promised'));
describe(
    'base.logger', function () {
        describe(
            'file appender', function () {
                before(
                    function (done) {
                        fs.remove('./.out/logs', done);
                    }
                );
                it(
                    'should be able to log messages in a file',
                    function (done) {
                        var logger = logProvider(
                            [
                                {
                                    pattern: '%5.5l | %m',
                                    appender: 'file',
                                    appenderOptions: {
                                        path: './.out/logs/log-file'
                                    }
                                }
                            ]
                        );
                        logger.debug('value', {a: 1, b: 2});
                        logger.info('value', {a: 1, b: 2});
                        logger.warn('value', {a: 1, b: 2});
                        logger.error('value', {a: 1, b: 2});
                        logger.debug('value', {a: 1, b: 2});
                        logger.info('value', {a: 1, b: 2});
                        logger.warn('value', {a: 1, b: 2});
                        logger.error('value', {a: 1, b: 2});
                        setTimeout(
                            function () {
                                fs.readFile(
                                    './.out/logs/log-file.log',
                                    'utf8',
                                    function (err, data) {
                                        if (err) {
                                            return done(err);
                                        }
                                        expect(data.split('\n')).to.eql(
                                            [
                                                'debug | value { a: 1, b: 2 }',
                                                ' info | value { a: 1, b: 2 }',
                                                ' warn | value { a: 1, b: 2 }',
                                                'error | value { a: 1, b: 2 }',
                                                'debug | value { a: 1, b: 2 }',
                                                ' info | value { a: 1, b: 2 }',
                                                ' warn | value { a: 1, b: 2 }',
                                                'error | value { a: 1, b: 2 }',
                                                ''
                                            ]
                                        );
                                        done();
                                    }
                                );
                            },
                            500
                        );
                    }
                );
                it(
                    'should be able to roll logs',
                    function (done) {
                        var logger = logProvider(
                            [
                                {
                                    pattern: '%5.5l | %m',
                                    appender: 'file',
                                    appenderOptions: {
                                        path: './.out/logs/log-file',
                                        roll: 'MMMM'
                                    }
                                }
                            ]
                        );
                        logger.debug('value', {a: 2, b: 2});
                        logger.info('value', {a: 2, b: 2});
                        logger.warn('value', {a: 2, b: 2});
                        logger.error('value', {a: 2, b: 2});
                        logger.debug('value', {a: 2, b: 2});
                        logger.info('value', {a: 2, b: 2});
                        logger.warn('value', {a: 2, b: 2});
                        logger.error('value', {a: 2, b: 2});
                        setTimeout(
                            function () {
                                fs.readFile(
                                        './.out/logs/log-file-' + moment().format('MMMM') + '.log',
                                    'utf8',
                                    function (err, data) {
                                        if (err) {
                                            return done(err);
                                        }
                                        expect(data.split('\n')).to.eql(
                                            [
                                                'debug | value { a: 2, b: 2 }',
                                                ' info | value { a: 2, b: 2 }',
                                                ' warn | value { a: 2, b: 2 }',
                                                'error | value { a: 2, b: 2 }',
                                                'debug | value { a: 2, b: 2 }',
                                                ' info | value { a: 2, b: 2 }',
                                                ' warn | value { a: 2, b: 2 }',
                                                'error | value { a: 2, b: 2 }',
                                                ''
                                            ]
                                        );
                                        done();
                                    }
                                )
                                ;
                            },
                            500
                        );
                    }
                );
            }
        );
    }
);

