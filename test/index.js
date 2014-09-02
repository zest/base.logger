'use strict';
var logger = require('../lib'),
    expect = require('chai').expect;
describe('base.logger', function () {
    // it should return a module
    it('it should return a module', function () {
        expect(logger).not.to.equal(undefined);
    });
});
