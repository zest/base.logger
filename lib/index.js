'use strict';
/**
 * @fileOverview base.logger is a basic logger component used throughout zest to log messages onto the
 * node console or in log files. It can be used as a zest component or as a standalone module
 * @module base-logger
 * @requires base-logger/formatter
 * @requires base-logger/appenders/console
 * @requires {@link external:merge}
 * @requires {@link external:util}
 */
var merge = require('merge');
var util = require('util');
// log levels enumeration
var level = {
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    none: 5
};
/**
 * @class module:base-logger~Logger
 * @augments module:base-logger~LoggerBase
 * @description the Logger class provides logging functions and other methods to log messages and profiling
 * @param {Array.<module:base-logger~LoggerConfigurations>} options - the log configuration options array
 * @param {string} group - the group that should be used for logging
 */
var Logger = function (options, group) {
    var logFunctions;
    var noOp = function () {
        return logFunctions;
    };
    logFunctions = {
        debug: noOp,
        info: noOp,
        warn: noOp,
        error: noOp
    };
    options.forEach(
        function (option) {
            var appender;
            // populate options with defaults
            option = merge(
                {
                    match: '^.*$',
                    appender: 'console',
                    level: 'debug',
                    pattern: {
                        debug: '\x1B[90m%t[HH.mm.ss.SSS]|\x1B[37m%-1.1l\x1B[90m|%20.20g\x1B[39m| \x1B[36m%m\x1B[39m',
                        info: '\x1B[90m%t[HH.mm.ss.SSS]|\x1B[37m%-1.1l\x1B[90m|%20.20g\x1B[39m| \x1B[32m%m\x1B[39m',
                        warn: '\x1B[90m%t[HH.mm.ss.SSS]|\x1B[37m%-1.1l\x1B[90m|%20.20g\x1B[39m| \x1B[33m%m\x1B[39m',
                        error: '\x1B[90m%t[HH.mm.ss.SSS]|\x1B[37m%-1.1l\x1B[90m|%20.20g\x1B[39m| \x1B[1m\x1B[31m%m' +
                            '\x1B[39m\x1B[22m'
                    }
                }, option
            );
            if (!new RegExp(option.match).test(group)) {
                // if the group does not match the configuration filter, we dont use it
                return;
            }
            // get the appropriate appender
            appender = require('./appenders/' + option.appender)(group, option.pattern, option.appenderOptions);
            Object.keys(appender).forEach(
                function (logFnName) {
                    var fn;
                    if (level[logFnName] < level[option.level]) {
                        return;
                    }
                    fn = logFunctions[logFnName];
                    logFunctions[logFnName] = function () {
                        appender[logFnName].apply(appender, arguments);
                        fn.apply({}, arguments);
                        return logFunctions;
                    };
                }
            );
        }
    );
    // create log functions
    (function (logger, levels) {
        levels.forEach(
            function (level) {
                logger[level] = function () {
                    if (!process.LOGGING_STOP) {
                        logFunctions[level].apply({}, arguments);
                    }
                    return logger;
                };
            }
        );
    }(
        this,
        [
            'debug',
            'info',
            'warn',
            'error'
        ]
    ));
    /**
     * @function group
     * @description Creates a new group from the existing logger group. The new Group will have a name
     * `<<thisGroup>> / <<groupName>>`
     * @param {string} groupName - the string to be prepended to the group name to create a new group
     * @memberof module:base-logger~Logger.prototype
     */
    this.group = function (groupName) {
        return new Logger(options, (group + '/' + groupName));
    };
};
/**
 * Profiles all function in the object and logs the start and end of all calls to the functions, optionally logging
 * arguments and return value.
 * @param {*} component - the object whose functions have to be profiled
 * @param {boolean} [verbose] - if true, the function arguments as well as the return value will be profiled
 */
Logger.prototype.profile = function (component, verbose) {
    var log = this;
    Object.keys(component).forEach(
        function (key) {
            var oldFn;
            if (!(component[key] instanceof Function)) {
                return;
            }
            oldFn = component[key];
            component[key] = function () {
                var retVal;
                var logProps = [];
                var timer;
                logProps.push(key);
                if (verbose) {
                    logProps.push('(');
                    logProps = logProps.concat(Array.prototype.slice.call(arguments));
                    logProps.push(')');
                }
                timer = new Date().getTime();
                retVal = oldFn.apply(this, arguments);
                timer = new Date().getTime() - timer;
                if (verbose && retVal) {
                    logProps.push('->');
                    logProps.push(retVal);
                }
                logProps.push('[');
                logProps.push(timer);
                logProps.push('ms]');
                log.debug.apply(log, logProps);
                return retVal;
            };
        }
    );
};
/**
 * This function returns a Logger object that can be used to log messages.
 * @param {string|Array.<module:base-logger~LoggerConfigurations>|module:base-logger~LogOptions} [options] - the
 * options used for initializing the logger.
 * @returns {module:base-logger~Logger} the logger object
 * @example
 * // To create a logger with all defaults, we just call the exported module function
 * // without any option
 * // create the logger
 * var logger = require('base.logger')();
 * // start logging
 * logger.debug('hello world!');
 *
 * @example
 * // If initialized with an array, the logger will assume it to be an array of
 * // configuration options.
 * // create the logger
 * var logger = require('base.logger')([
 *     // configuration option
 *     {
 *         match: '^.*$', // group patterns matcher
 *         appender: 'console', // where to log
 *         level: 'debug', // the log level
 *         pattern: '%t[HH.mm.ss.SSS]|%-1.1l%20.20g| %m' // the logger pattern
 *     }
 * ]);
 * // start logging
 * logger.debug('hello world!');
 *
 * @example
 * // If a string is used for initialization, it is assumed to be the group name. The
 * // logger will initialize with default configuration (which makes it log everything
 * // to console) and the returned logger will have its group initialized
 * // create the logger
 * var logger = require('base.logger')('main');
 * // start logging
 * logger.debug('hello world!');
 *
 * @example
 * // To initialize the logger with both the group and settings, we use an object form
 * // as shown below.
 * // create the logger
 * var logger = require('base.logger')({
 *     group: 'main',
 *     settings: [
 *         // configuration option
 *         {
 *             match: '^.*$', // group patterns matcher
 *             appender: 'console', // where to log
 *             level: 'debug', // the log level
 *             pattern: '%t[HH.mm.ss.SSS]|%-1.1l%20.20g| %m' // the logger pattern
 *         }
 *     ]
 * });
 * // start logging
 * logger.debug('hello world!');
 */
module.exports = function (options) {
    if (!options) {
        options = [
            {}
        ];
    }
    if (util.isArray(options)) {
        return new Logger(options, '');
    } else if (typeof options === 'string') {
        return new Logger(
            [
                {}
            ], options
        );
    } else {
        return new Logger(options.settings, (options.group || ''));
    }
};
/**
 * @function stop
 * @description Stops all loggers from logging
 * @memberof module:base-logger
 */
module.exports.stop = function () {
    process.LOGGING_STOP = true;
};
/**
 * @function start
 * @description Resumes logging function after it has been stopped
 * @memberof module:base-logger
 */
module.exports.start = function () {
    process.LOGGING_STOP = false;
};
