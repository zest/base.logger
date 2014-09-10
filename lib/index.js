'use strict';
/**
 * @fileOverview logger is a basic logger module used throughout the run scripts to log onto the node console or files.
 * It takes a module name as reference and returns a logger object with log, info, warn and error methods.
 * @module base-logger
 * @requires base-logger/appenders/console
 * @requires base-logger/appenders/no-op
 * @requires util
 */
// which logs to consider if log level is one of the keys
var logLevels = {
        log: ['log', 'info', 'warn', 'error'],
        info: ['info', 'warn', 'error'],
        warn: ['warn', 'error'],
        error: ['error'],
        none: []
    },
    // adds a new logger
    wrapLogger = function (previousLogger, logLevel, appenderName, moduleName) {
        // check if the appender exists
        try {
            var appender = require('./appenders/' + appenderName)(moduleName);
            logLevels[logLevel].forEach(function (item) {
                var preLogger = previousLogger[item];
                previousLogger[item] = function () {
                    appender[item].apply(appender[item], arguments);
                    preLogger.apply(preLogger, arguments);
                };
            });
        } catch (ignore) {
            // ignore silently
        }
        return previousLogger;
    };
/**
 * This function returns a logger for the module specified by the moduleName parameter.
 * @param {String} moduleName - the name of the module for which the logger should be returned
 * @returns {module:base-logger~Logger} a Logger object with logging functions.
 */
module.exports = function (moduleName) {
    // if the module name is undefined, we set it blank
    if (!moduleName) {
        moduleName = '';
    }
    // if configuration is not done, return the default console logger
    if (!process.SOUL_BASE_LOGGER) {
        return require('./appenders/console')(moduleName);
    }
    // if there are configurations, read them and return appropriate loggers
    var logger = require('./appenders/no-op')(moduleName);
    process.SOUL_BASE_LOGGER.forEach(function (setting) {
        // if config has a pattern, test the module name against it.
        if (!setting.pattern || setting.pattern.test(moduleName)) {
            logger = wrapLogger(logger, (setting.level || 'log'), (setting.appender || 'console'), moduleName);
        }
    });
    return logger;
};
/**
 * Configures the logger.
 * @function
 * @name module:base-logger.configure
 * @param {Array.<module:base-logger~LoggerSettings>} settings - the settings used for logger
 */
module.exports.configure = function (settings) {
    if(!settings) {
        process.SOUL_BASE_LOGGER = undefined;
        return;
    }
    // we put this in process so that different versions of the logger can still use a common configuration 
    settings.forEach(function (setting) {
        if (typeof setting.pattern === 'string') {
            setting.pattern = new RegExp(setting.pattern);
        }
    });
    process.SOUL_BASE_LOGGER = settings;
};
// documenting the Logger object returned by the logger module
/**
 * The logger object used to log messages
 * @typedef {object} module:base-logger~Logger
 * @property {module:base-logger~LoggingFunction} log - least priority logging function
 * @property {module:base-logger~LoggingFunction} info - third highest priority logging function
 * @property {module:base-logger~LoggingFunction} warn - second highest priority logging function
 * @property {module:base-logger~LoggingFunction} error - highest priority logging function
 */
// documenting the logging functions
/**
 * A logging function is used to log values to the console or elsewhere as configured. It can be called with anything
 * as parameter.
 * @callback module:base-logger~LoggingFunction
 * @param {...Object|String} arguments - the objects to log.
 */
// documenting the Logger settings object
/**
 * The logger object used to configure loggers
 * @typedef {object} module:base-logger~LoggerSettings
 * @property {regex} [pattern=\.*\] - pattern is used to filter modules to log. Only moduleNames matching the pattern 
 * will be parsed through this setting
 * @property {string} [level='log'] - the log level filters the actual {@link module:base-logger~LoggingFunction} in the
 * {@link module:base-logger~Logger} object that are considered for logging. Those with priority lower than the passed
 * level will be ignored. 
 * @property {string} [appender='console'] - appender defines the logging location.
 */
