'use strict';
var logProvider = require('../lib');
var chai = require('chai');
var expect = require('chai').expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
describe(
    'base.logger', function () {
        describe(
            'basic functionalities', function () {
                // it should return a module
                it(
                    'should return a module',
                    function () {
                        expect(logProvider).not.to.equal(undefined);
                    }
                );
            }
        );
    }
);

