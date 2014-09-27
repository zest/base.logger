'use strict';
/**
 * @fileOverview file appender is used by the logger to log messages in a file
 * @module base-logger/appenders/file
 * @requires {@link external:util}
 * @requires {@link external:fs-extra}
 * @requires {@link external:moment}
 */
var fs = require('fs-extra');
var moment = require('moment');
/**
 * This function returns a logger which logs a decorated message in a file.
 * @param {String} group - the name of the group for which the logger should be returned
 * @param {string|module:base-logger~LogPattern} [pattern] the pattern used for formatting the logs. If the value is
 * a `string`, the same pattern will be used for logging `debug`, `info`, `warn` and `error` messages. See
 * {@link module:base-logger~LogPattern} for details on how patterns are used.
 * @param {module:base-logger/appenders/file~AppenderOptions} appenderOptions - the options used to configure the file
 * appender
 * @returns {module:base-logger~LoggerBase} an object with `debug`, `info`, `warn` and `error` functions.
 */
module.exports = function (group, pattern, appenderOptions) {
    var format = require('../formatter')(group, pattern);
    var unLogged = [];
    var appending = false;
    var appendLog = function () {
        var logName;
        if (appending || unLogged.length === 0) {
            return;
        }
        // create the name of the log file from roll and logging time
        logName = appenderOptions.path +
            (appenderOptions.roll ? ('-' + moment(unLogged[0][0]).format(appenderOptions.roll)) : '') +
            '.log';
        appending = true;
        fs.ensureFile(
            logName,
            function () {
                fs.appendFile(
                    logName,
                    unLogged.map(
                        function (item) {
                            return format(item[0], item[1], item[2]) + '\n';
                        }
                    ).join('')
                );
                unLogged = [];
                appending = false;
            }
        );
    };
    return {
        debug: function () {
            unLogged.push(
                [
                    Date.now(),
                    'debug',
                    arguments
                ]
            );
            process.nextTick(appendLog);
        },
        info: function () {
            unLogged.push(
                [
                    Date.now(),
                    'info',
                    arguments
                ]
            );
            process.nextTick(appendLog);
        },
        warn: function () {
            unLogged.push(
                [
                    Date.now(),
                    'warn',
                    arguments
                ]
            );
            process.nextTick(appendLog);
        },
        error: function () {
            unLogged.push(
                [
                    Date.now(),
                    'error',
                    arguments
                ]
            );
            process.nextTick(appendLog);
        }
    };
};