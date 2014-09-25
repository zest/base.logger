'use strict';
/**
 * @fileOverview console appender is used by the logger to log messages in console
 * @module base-logger/appenders/console
 * @requires util
 */
require('colors');
/**
 * This function returns a logger which logs a decorated message at the console.
 * @param {String} moduleName - the name of the module for which the logger should be returned
 * @returns {module:logger~Logger} a Logger object with logging functions.
 */
module.exports = function (group, pattern) {
    var format = require('../formatter')(group, pattern);
    return {
        debug: function () {
            console.log(format(new Date(), 'debug', arguments).italic.grey);
        },
        info: function () {
            console.log(format(new Date(), 'info', arguments).green);
        },
        warn: function () {
            console.log(format(new Date(), 'warn', arguments).yellow);
        },
        error: function () {
            console.log(format(new Date(), 'error', arguments).bold.red);
        }
    };
};
