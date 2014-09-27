'use strict';
/**
 * @fileOverview console appender is used by the logger to log messages in console
 * @module base-logger/appenders/console
 * @requires {@link external:util}
 */
/**
 * This function returns a logger which logs a decorated message at the console.
 * @param {String} group - the name of the group for which the logger should be returned
 * @property {string|module:base-logger~LogPattern} [pattern] the pattern used for formatting the logs. If the value is
 * a `string`, the same pattern will be used for logging `debug`, `info`, `warn` and `error` messages. See
 * {@link module:base-logger~LogPattern} for details on how patterns are used.
 * @returns {module:base-logger~LoggerBase} an object with `debug`, `info`, `warn` and `error` functions.
 */
module.exports = function (group, pattern) {
    var format = require('../formatter')(group, pattern);
    return {
        debug: function () {
            console.log(format(new Date(), 'debug', arguments));
        },
        info: function () {
            console.log(format(new Date(), 'info', arguments));
        },
        warn: function () {
            console.log(format(new Date(), 'warn', arguments));
        },
        error: function () {
            console.log(format(new Date(), 'error', arguments));
        }
    };
};
