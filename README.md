[![Dependencies][dependencies-image]][dependencies-link]
[![Dev Dependencies][dev-dependencies-image]][dev-dependencies-link]
[![Peer Dependencies][peer-dependencies-image]][peer-dependencies-link]

[![Quality][quality-image]][quality-link]
[![Build Status][build-status-image]][build-status-link]
[![Coverage Status][coverage-status-image]][coverage-status-link]
[![License][license-image]][license-link]

# zest / base.logger
> base.logger is a basic logger component used throughout zest to create log files or to log onto the node console. It
> can be used as a zest component or as a standalone module 


# initialization

the base logger module exports a function which returns a logger object. The logger object can then be used to log 
messages.

## configuring the base logger

To create a logger with all defaults, we just call the exported module function.

```js
// create the logger
var logger = require('base.logger')();
// start logging
logger.debug('hello zest!');
```

However, additional configurations can also be provided.

If initialized with an array, the logger will assume it to be an array of configuration options.

```js
// create the logger
var logger = require('base.logger')([
    // configuration option
    {
        match: '^.*$', // group patterns matcher
        appender: 'console', // where to log
        level: 'debug', // the log level
        pattern: '%t[HH.mm.ss.SSS]|%-1.1l%20.20g| %m' // the logger pattern
    }
]);
// start logging
logger.debug('hello zest!');
```

If a string is used for initialization, it is assumed to be the group name. The logger will initialize with default
configuration (which makes it log everything to console) and the returned logger will have its group initialized 

```js
// create the logger
var logger = require('base.logger')('main');
// start logging
logger.debug('hello zest!');
```

To initialize the logger with both the group and settings, we use an object form as shown below.

```js
// create the logger
var logger = require('base.logger')({
    group: 'main',
    settings: [
        // configuration option
        {
            match: '^.*$', // group patterns matcher
            appender: 'console', // where to log
            level: 'debug', // the log level
            pattern: '%t[HH.mm.ss.SSS]|%-1.1l%20.20g| %m' // the logger pattern
        }
    ]
});
// start logging
logger.debug('hello zest!');
```

### configuration options

 -  **`match`** will ignore this configuration for group patterns that do not match the regex provided in this property
 
 -  **`appender`** tells the logger where to log. Possible values are `console` and `file`
 
 -  **`level`** is the log level upto which logging should happen. Possible values are `debug`, `info`, `warn`, `error`
    and `none`.
    
 -  **`pattern`** is the pattern used for formatting the logs. The value can be a string or an object.
     -  If the value is a `string`, the same pattern will be used for logging `debug`, `info`, `warn` and `error`
        messages
     
     -  If the value is an `object`, it should have keys `debug`, `info`, `warn` and `error`, each with their pattern
        strings.


#### the pattern strings

Pattern Strings are parsed to generate logs. The conversion pattern is closely related to the conversion pattern of the
`printf` function in `C`. A conversion pattern is composed of literal text and format control expressions called
conversion specifiers.

Each conversion specifier starts with a percent sign (%) and is followed by optional format modifiers and a conversion
character. The conversion character specifies the type of data, e.g. level, group, message and time. The format
modifiers control such things as field width, padding, left and right justification. Any literal text can be inserted
within the conversion pattern.

The conversion characters are:

 -  `g` for outputting the group name
 -  `l` for outputting the log level
 -  `t` for outputting the current time
 -  `m` for outputting the actual log
 
A typical conversion specifier will be of the form

```
%[<<- for left align>>][<<minwidth>>][.][<<max width>>]<<conversion character>>[<<format>>]
```

format are supported only in case of Dates and is should be [moment.js](http://momentjs.com/) compatible


> Example:
>
> `%10g | %4.4l - %t[dd/MM/yyyy] - %m`
> 
> would yield the output
> ```
> modulename |ebug - [12/12/2014] - Message 1
> modulename |warn - [12/12/2014] - Message 1
> ```
>
> `%15g | %4l - %t[dd/MM/yyyy] - %m`
> 
> would yield the output
> ```
>      modulename |debug - [12/12/2014] - Message 1
>      modulename |warn - [12/12/2014] - Message 1
> ```


### grouping logs

Groups are used to aggregate log statements and identify them. Groups can be displayed in the logs by using the `%g`
conversion specifier.

Every Logger object has a `group` method that creates a new Logger object with the new group name as
`parentgroup / newGroup` 

This helps in filtering log statements in configurations. Typically, Every module should log into its own group.


[dependencies-image]: http://img.shields.io/david/zest/base.logger.svg?style=flat-square
[dependencies-link]: https://david-dm.org/zest/base.logger#info=dependencies&view=list
[dev-dependencies-image]: http://img.shields.io/david/dev/zest/base.logger.svg?style=flat-square
[dev-dependencies-link]: https://david-dm.org/zest/base.logger#info=devDependencies&view=list
[peer-dependencies-image]: http://img.shields.io/david/peer/zest/base.logger.svg?style=flat-square
[peer-dependencies-link]: https://david-dm.org/zest/base.logger#info=peerDependencies&view=list
[license-image]: http://img.shields.io/badge/license-UNLICENSE-brightgreen.svg?style=flat-square
[license-link]: http://unlicense.org
[quality-image]: http://img.shields.io/codeclimate/github/zest/base.logger.svg?style=flat-square
[quality-link]: https://codeclimate.com/github/zest/base.logger
[build-status-image]: http://img.shields.io/travis/zest/base.logger.svg?style=flat-square
[build-status-link]: https://travis-ci.org/zest/base.logger
[coverage-status-image]: http://img.shields.io/coveralls/zest/base.logger.svg?style=flat-square
[coverage-status-link]: https://coveralls.io/r/zest/base.logger