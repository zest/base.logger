'use strict';
/**
 * @fileOverview no-op appender is a dummy appender module for logger that doesn't do anything
 * @module logger/appenders/no-op
 * @requires util
 */
var noOp = function () {
    return;
};
/**
 * This function returns a logger which that not do anything.
 * @param {String} moduleName - the name of the module for which the logger should be returned
 * @returns {module:logger~Logger} a Logger object with logging functions. 
 */
module.exports = function (moduleName) {
    return {
        log: noOp,
        info: noOp,
        warn: noOp,
        error: noOp
    };
};