'use strict';
var merge = require('merge');
var util = require('util');
var level = {
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    none: 5
};
/*
 * options: { group:'', settings: [{match: '.*', appender: 'console', level: 'debug', pattern: '%d %m'}, ...]
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
            option = merge(
                {
                    match: '^.*$',
                    appender: 'console',
                    level: 'debug',
                    pattern: '%30.30g | %-5.5l - %t[MMMM Do YYYY, h:mm:ss a] - %m'
                }, option
            );
            if (!new RegExp(option.match).test(group)) {
                return;
            }
            appender = require('./appenders/' + option.appender)(group, option.pattern);
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
    this.debug = logFunctions.debug;
    this.info = logFunctions.info;
    this.warn = logFunctions.warn;
    this.error = logFunctions.error;
    this.group = function (groupName) {
        return new Logger(options, (group + '/' + groupName));
    };
};
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
module.exports = function (options) {
    if (!options) {
        options = [
            {}
        ];
    }
    if (util.isArray(options)) {
        return new Logger(options, '');
    } else {
        return new Logger(options.settings, (options.group || ''));
    }
};