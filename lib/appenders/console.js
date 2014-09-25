'use strict';
/**
 * @fileOverview console appender is used by the logger to log messages in console
 * @module base-logger/appenders/console
 * @requires util
 */
var util = require('util');
// %30g - group, %m - message, %t - time, %l - log level
var getFormatter = function (pattern) {
    return function (message, level, group) {
    };
};
/**
 * This function returns a logger which logs a decorated message at the console.
 * @param {String} moduleName - the name of the module for which the logger should be returned
 * @returns {module:logger~Logger} a Logger object with logging functions.
 */
module.exports = function (group, pattern) {
    return {
        debug: function () {
            console.log(util.format('%s|', 'hello'));
        },
        info: function () {
            console.log(util.format('%s|', 'hello'));
        },
        warn: function () {
            console.log(util.format('%s|', 'hello'));
        },
        error: function () {
            console.log(util.format('%s|', 'hello'));
        }
    };
};
