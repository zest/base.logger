'use strict';
/**
 * @fileOverview console appender is used by the logger to log messages in console
 * @module logger/appenders/console
 * @requires util
 */
var util = require('util'),
    // list of wraps for different styles. every value in fontStyles is an array of two strings, the first string is 
    // for appending and the second string is for prepending 
    fontStyles = {
        //styles
        bold: ['\x1B[1m', '\x1B[22m'],
        italic: ['\x1B[3m', '\x1B[23m'],
        underline: ['\x1B[4m', '\x1B[24m'],
        inverse: ['\x1B[7m', '\x1B[27m'],
        strikethrough: ['\x1B[9m', '\x1B[29m'],
        //text colors
        //grayscale
        white: ['\x1B[37m', '\x1B[39m'],
        grey: ['\x1B[90m', '\x1B[39m'],
        black: ['\x1B[30m', '\x1B[39m'],
        //colors
        blue: ['\x1B[34m', '\x1B[39m'],
        cyan: ['\x1B[36m', '\x1B[39m'],
        green: ['\x1B[32m', '\x1B[39m'],
        magenta: ['\x1B[35m', '\x1B[39m'],
        red: ['\x1B[31m', '\x1B[39m'],
        yellow: ['\x1B[33m', '\x1B[39m'],
        //background colors
        //grayscale
        whiteBG: ['\x1B[47m', '\x1B[49m'],
        greyBG: ['\x1B[49;5;8m', '\x1B[49m'],
        blackBG: ['\x1B[40m', '\x1B[49m'],
        //colors
        blueBG: ['\x1B[44m', '\x1B[49m'],
        cyanBG: ['\x1B[46m', '\x1B[49m'],
        greenBG: ['\x1B[42m', '\x1B[49m'],
        magentaBG: ['\x1B[45m', '\x1B[49m'],
        redBG: ['\x1B[41m', '\x1B[49m'],
        yellowBG: ['\x1B[43m', '\x1B[49m']
    },
    // formats the content with the array of styles
    format = function (content, styles) {
        styles.forEach(function (style) {
            content = content.replace(/^/gm, fontStyles[style][0]).replace(/$/gm, fontStyles[style][1]);
        });
        return content;
    },
    // decorates the objects to log
    spitString = function (args, styles, prefix) {
        if (args.length) {
            return format(
                Array.prototype.slice.call(args, 0).map(
                    function (item) {
                        if (typeof item === 'object') {
                            return util.inspect(item);
                        }
                        return item;
                    }
                ).join(' '),
                styles
            ).replace(/^/gm, prefix);
        }
        return prefix;
    };
/**
 * This function returns a logger which logs a decorated message at the console.
 * @param {String} moduleName - the name of the module for which the logger should be returned
 * @returns {module:logger~Logger} a Logger object with logging functions. 
 */
module.exports = function (moduleName) {
    // pad the module name with spaces to left
    var prefix = format(('                              ' + moduleName).slice(-32), ['italic', 'yellow']) + ' | ';
    return {
        log: function () {
            console.log(spitString(arguments, ['grey'], prefix));
        },
        info: function () {
            console.log(spitString(arguments, ['cyan', 'bold'], prefix));
        },
        warn: function () {
            console.log(spitString(arguments, ['magenta', 'underline'], prefix));
        },
        error: function () {
            console.log(spitString(arguments, ['red', 'bold'], prefix));
        }
    };
};