'use strict';
/**
 * @fileOverview format module is used to format log messages with a pattern.
 * @module base-logger/formatter
 * @requires {@link external:moment}
 * @requires {@link external:util}
 */
var util = require('util');
var moment = require('moment');
/**
 * This function returns a formatter function which is used to format logs
 * @param {string} group the log group
 * @property {string|module:base-logger~LogPattern} [pattern] the pattern used for formatting the logs. If the value is
 * a `string`, the same pattern will be used for logging `debug`, `info`, `warn` and `error` messages. See
 * {@link module:base-logger~LogPattern} for details on how patterns are used.
 * @returns {module:base-logger/formatter~Formatter} the formatter function
 */
module.exports = function (group, pattern) {
    // normalize the passes pattern into a map
    var patternMap = {
    };
    // we populate placeholders in the pattern using the object keys
    var format = function (object) {
        return patternMap[object.l].replace(
            /\%(-)?([0-9]*)(\.([0-9]*))?([a-z]{1})(\[.*?\])?/g,
            function () {
                return parse(
                    object[arguments[5]],
                    (arguments[1] === '-'),
                    (parseInt(arguments[2], 10) || 0),
                    (parseInt(arguments[4], 10) || 999),
                    (arguments[6] && arguments[6].replace(/[\[\]]/g, ''))
                );
            }
        );
    };
    // here we add padding and alignment to any value
    var parse = function (value, rpad, min, max, format) {
        if (value instanceof Date && format) {
            value = moment(value).format(format);
        }
        while (value.length < min) {
            if (rpad) {
                value = value + ' ';
            } else {
                value = ' ' + value;
            }
        }
        if (value.length > max) {
            if (rpad) {
                value = value.substr(0, max);
            } else {
                value = value.substr(-max);
            }
        }
        return value;
    };
    if (typeof pattern === 'string') {
        patternMap.debug = patternMap.info = patternMap.warn = patternMap.error = pattern;
    } else {
        Object.keys(pattern).forEach(
            function (keys) {
                keys.split(',').forEach(
                    function (key) {
                        patternMap[key] = pattern[keys];
                    }
                );
            }
        );
    }
    /**
     * The formatter function is used to format objects into a loggable string
     * @param {Date} time - the logging time
     * @param {string} logLevel - the level of the logger message
     * @param {Array.<*>} args - the objects or Strings to log
     * @returns {string} the parsed and formatted logggable string
     * @callback module:base-logger/formatter~Formatter
     */
    return function (time, logLevel, args) {
        return format(
            {
                g: group,
                l: logLevel,
                t: new Date(),
                m: Array.prototype.slice.call(args).map(
                    function (val) {
                        if (typeof val === 'object') {
                            return util.inspect(val);
                        }
                        return val;
                    }
                ).join(' ')
            }
        );
    };
};
