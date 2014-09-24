'use strict';
var merge = require('merge');
var level = {
    debug: 1,
    info: 2,
    warn: 3,
    error: 4
};
/*
 * options: { group:'', settings: [{match: '.*', appender: 'console', level: 'debug', pattern: '%d %m'}, ...]
 */
var Logger = function (options) {
    var logFunctions,
        noOp = function () {
        return logFunctions;
    };
    options.settings = options.settings || [{}];
    this.getOptions = function () {
        return options;
    };
    logFunctions = {
        debug: noOp,
        info: noOp,
        warn: noOp,
        error: noOp
    };
    options.settings.forEach(function (option) {
        option.match = option.match || '^.*$';
        option.appender = option.appender || 'console';
        option.level = option.level || 'debug';
        option.pattern = option.pattern || '%d %m';
        if(!new RegExp(option.match).test(options.group)) {
            return;
        }
        var appender = require('./appenders/' + option.appender)(options.group, option.pattern);
        Object.keys(appender).forEach(function (logFnName) {    
            if(level[logFnName] < level[option.level]) {
                return;
            }
            var fn = logFunctions[logFnName];
            logFunctions[logFnName] = function () {
                appender[logFnName].apply(appender, arguments);
                fn.apply({}, arguments);
                return logFunctions;
            };
        });
    });
    
    this.debug = logFunctions.debug;
    this.info = logFunctions.info;
    this.warn = logFunctions.warn;
    this.error = logFunctions.error;
};


Logger.prototype.profile = function (component, verbose) {
    var log = this;
    Object.keys(component).forEach(function (key) {
        if(!(component[key] instanceof Function)){
            return;
        }
        var oldFn = component[key];
        component[key] = function () {
            log.debug(oldFn.name, 'start');
            if(verbose) {
                log.debug.apply(log, ['\t arguments: '].concat(arguments));
            }
            var retVal = oldFn.apply(this, arguments);
            if(verbose) {
                log.debug('\t returning: ', retVal);
            }
            log.debug(oldFn.name, 'end');
            return retVal;
        };
    });
};
Logger.prototype.group = function (groupName) {
    var options = merge(true, this.getOptions());
    options.group = options.group + '/' + groupName;
    return new Logger(options);
};

module.exports = function (options) {
    return new Logger(options);
};