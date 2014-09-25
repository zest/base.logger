'use strict';
var util = require('util');
var moment = require('moment');

// %30g | %4l - %t[dd/MM/yyyy] - %m
module.exports = function (group, pattern) {
    var format = function (object) {
        return pattern.replace(
            /\%(-)?([0-9]*)(\.([0-9]*))?([a-z]{1})(\[.*?\])?/g,
            function () {
                return parse(
                    object[arguments[5]],
                    (arguments[1] === '-'),
                    (parseInt(arguments[2]) || 0),
                    (parseInt(arguments[4]) || 999),
                    arguments[6] && arguments[6].replace(/[\[\]]/g, '')
                ); 
            }
        );
    };
    
    var parse = function (value, rpad, min, max, format) {
        if(value instanceof Date && format) {
            value = moment(value).format(format);
        }
        while(value.length < min) {
            if(rpad) {
                value = value + ' ';
            } else {
                value = ' ' + value;
            }
        }
        if(value.length > max) {
            if(rpad) {
                value = value.substr(0,max);
            } else {
                value = value.substr(-max);
            }
        }
        return value;
    };
    return function (time, logLevel, args) {
        return format(
            {
                g: group,
                l: logLevel,
                t: new Date(),
                m: Array.prototype.slice.call(args).map(function(val){
                    return util.inspect(val);
                }).join(' ')
            }
        );
    };
};