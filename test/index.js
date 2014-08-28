'use strict';
var logger = require('./injector')();
describe('base.logger', function () {
    // it should return a module
    it('it should return a module', function () {
        expect(logger).not.toBe(undefined);
    });
});
