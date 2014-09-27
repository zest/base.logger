/**
 * @typedef module:base-logger~LoggerConfigurations
 * @description This object is used to configure the logger.
 * @property {string} [match=^.*$] - this configuration will be used for group patterns that match the regex provided
 * in `match` property
 * @property {string} [appender=console] - where to log. Possible values are `console` and `file`
 * @property {string} [level=debug] - the log level upto which logging should happen. Possible values are `debug`,
 * `info`, `warn`, `error` and `none`.
 * @property {string|module:base-logger~LogPattern} [pattern] the pattern used for formatting the logs. If the value is
 * a `string`, the same pattern will be used for logging `debug`, `info`, `warn` and `error` messages. See
 * {@link module:base-logger~LogPattern} for details on how patterns are used.
 */
/**
 * @typedef module:base-logger~LogOptions
 * @description LogOptions object can be passed as an alternate way to configure the logger.
 * @property {string} [group] - the group pattern for which the configuration should be used.
 * @property {Array.<module:base-logger~LoggerConfigurations>} [settings] - the logger configurations
 */
/**
 * @typedef module:base-logger/appenders/file~AppenderOptions
 * @property {string} path - which is the path to the file where the logs should be saved. The `path` should be without
 * extension.
 * @property {string} [roll] - if used, defines when new log files should be created and how it should be rolled. `roll`
 * can be any momentjs date format. the file name of log files will be appended with the time formated in the specified
 * format and whenever the parsed value changes, a new log file will be created.
 *
 * > For example,
 * >
 * > a value of `YYYYM` will create one file for each month.
 * >
 * > For Jan 2015, the filename will be `<<value of path>>-20151.log`.
 *
 */
/**
 * @typedef module:base-logger~LogPattern
 * @property {string} debug - pattern to be used to format debug logs
 * @property {string} info - pattern to be used to format info logs
 * @property {string} warn - pattern to be used to format warn logs
 * @property {string} error - pattern to be used to format error logs
 * @description the LogPattern object defines the different patterns to be used for formatting the logs
 * Pattern Strings are parsed to generate logs. The conversion pattern is closely related to the conversion pattern of
 * the `printf` function in `C`. A conversion pattern is composed of literal text and format control expressions called
 * conversion specifiers.
 *
 * Each conversion specifier starts with a percent sign (%) and is followed by optional format modifiers and a
 * conversion character. The conversion character specifies the type of data, e.g. level, group, message and time. The
 * format modifiers control such things as field width, padding, left and right justification. Any literal text can be
 * inserted within the conversion pattern.
 *
 * The conversion characters are:
 *
 *  -  `g` for outputting the group name
 *  -  `l` for outputting the log level
 *  -  `t` for outputting the current time
 *  -  `m` for outputting the actual log
 *
 * A typical conversion specifier will be of the form
 *
 * ```
 * %[<<- for left align>>][<<minwidth>>][.][<<max width>>]<<conversion character>>[<<format>>]
 * ```
 *
 * format are supported only in case of Dates and is should be [moment.js](http://momentjs.com/) compatible
 *
 *
 * > Example:
 * >
 * > `%10g | %4.4l - %t[dd/MM/yyyy] - %m`
 * >
 * > would yield the output
 * > ```
 * > modulename |ebug - [12/12/2014] - Message 1
 * > modulename |warn - [12/12/2014] - Message 1
 * > ```
 * >
 * > `%15g | %4l - %t[dd/MM/yyyy] - %m`
 * >
 * > would yield the output
 * > ```
 * >      modulename |debug - [12/12/2014] - Message 1
 * >      modulename |warn - [12/12/2014] - Message 1
 * > ```
 */
/**
 * @class module:base-logger~LoggerBase
 * @description The logger base class provides the basic logger methods `debug`, `info`, `error` and `warn`
 */
/**
 * @function debug
 * @description Creates a debug log
 * @param {...*} args - the objects to be logged
 * @memberof! module:base-logger~LoggerBase.prototype
 */
/**
 * @function info
 * @description Creates a informational log
 * @param {...*} args - the objects to be logged
 * @memberof! module:base-logger~LoggerBase.prototype
 */
/**
 * @function warn
 * @description Creates a warning log
 * @param {...*} args - the objects to be logged
 * @memberof! module:base-logger~LoggerBase.prototype
 */
/**
 * @function error
 * @description Creates a error log
 * @param {...*} args - the objects to be logged
 * @memberof! module:base-logger~LoggerBase.prototype
 */
/**
 * Merge multiple objects into one, optionally creating a new cloned object. Similar to the jQuery.extend but more
 * flexible. Works in Node.js and the browser
 * @external merge
 * @see {@link https://www.npmjs.org/package/merge}
 */
/**
 * Parse, validate, manipulate, and display dates in javascript.
 * @external moment
 * @see {@link http://momentjs.com/}
 */
/**
 * Utility functions for node
 * @external util
 * @see {@link http://nodejs.org/api/util.html}
 */
/**
 * fs-extra contains methods that aren't included in the vanilla Node.js fs package. Such as mkdir -p, cp -r,
 * and rm -rf.
 * @external fs-extra
 * @see {@link https://www.npmjs.org/package/fs-extra}
 */