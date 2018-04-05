(() => {
    'use strict';

/**
 * Tests for the ng-apimock plugin.
 */
describe('ngApimock', function () {
    const hooker = require('hooker');
    const fsExtra = require('fs-extra');
    const path = require('path');
    const ngApimock = require('./../../tasks/index')();
    const DEFAULT_OUTPUT_DIR = '.tmp/mocks';
    const SOME_OTHER_DIR = '.tmp/some-mock-dir';

    let log;

    beforeEach(function () {
        log = {
            ok: [],
            warn: [],
            error: []
        };

        fsExtra.emptydirSync(DEFAULT_OUTPUT_DIR);
        fsExtra.emptydirSync(SOME_OTHER_DIR);
    });

    hooker.hook(console, "log", function () {
        log.ok.push(arguments[0]);
    });
    hooker.hook(console, "info", function () {
        log.ok.push(arguments[0]);
    });
    hooker.hook(console, "warn", function () {
        log.warn.push(arguments);
    });
    hooker.hook(console, "error", function () {
        log.error.push(arguments[0]);
    });

    it('should fail when no configuration has been provided in the configuration', function (done) {
        ngApimock.run()
        .then(function () {
            expect('This test should fail').toBeNull();
        })
        .catch(function () {
            expect(log.error[0]).toBe('No configuration has been specified.');
        }).then(function () {
            done();
        });
    });

    it('should fail when no sources directory has been provided in the configuration', function (done) {
        ngApimock.run({})
        .then(function () {
            expect('This test should fail').toBeNull();
        })
        .catch(function () {
            expect(log.error[0]).toBe('No mock source directory have been specified.');
        }).then(function () {
            done();
        });
    });

    it('should generate everything in the provided directory', function (finish) {
        const done = jasmine.createSpy('done');
        const SOME_OTHER_DIR = '.tmp/some-mock-dir';

        ngApimock.run({
            outputDir: SOME_OTHER_DIR,
            src: 'test/mocks/api',
            done: done
        }).then(function () {
            expect(log.ok.length).toBe(4);
            expect(log.ok[0]).toBe('Process all the mocks');
            expect(log.ok[1]).toBe('Register mocks');
            expect(log.ok[2]).toBe('Generate the mocking web interface');
            expect(log.ok[3]).toBe('Generate protractor.mock.js');
            expect(fsExtra.existsSync(SOME_OTHER_DIR + path.sep + 'index.html')).toBeTruthy();
            expect(fsExtra.existsSync(SOME_OTHER_DIR + path.sep + 'js' + path.sep + 'angular.min.js')).toBeTruthy();
            expect(fsExtra.existsSync(SOME_OTHER_DIR + path.sep + 'js' + path.sep + 'angular-resource.min.js')).toBeTruthy();
            expect(fsExtra.existsSync(SOME_OTHER_DIR + path.sep + 'js' + path.sep + '_ngApimock.js')).toBeTruthy();
            expect(fsExtra.existsSync(SOME_OTHER_DIR + path.sep + 'js' + path.sep + 'ngapimock.component.js')).toBeTruthy();
            expect(fsExtra.existsSync(SOME_OTHER_DIR + path.sep + 'js' + path.sep + 'ngapimock.controller.js')).toBeTruthy();
            expect(fsExtra.existsSync(SOME_OTHER_DIR + path.sep + 'js' + path.sep + 'mocks.service.js')).toBeTruthy();
            expect(fsExtra.existsSync(SOME_OTHER_DIR + path.sep + 'js' + path.sep + 'variables.service.js')).toBeTruthy();
            expect(fsExtra.existsSync(SOME_OTHER_DIR + path.sep + 'css' + path.sep + 'main.css')).toBeTruthy();
            expect(fsExtra.existsSync(SOME_OTHER_DIR + path.sep + 'protractor.mock.js')).toBeTruthy();
            expect(done).toHaveBeenCalled();
        }).catch(function () {
            expect('This test should fail').toBeNull();
        }).then(function () {
            finish();
        });
    });

    it('should generate everything in the default directory', function (done) {
        ngApimock.run({
            src: 'test/mocks/api'
        }).then(function () {
            expect(log.ok.length).toBe(4);
            expect(log.ok[0]).toBe('Process all the mocks');
            expect(log.ok[1]).toBe('Register mocks');
            expect(log.ok[2]).toBe('Generate the mocking web interface');
            expect(log.ok[3]).toBe('Generate protractor.mock.js');
            expect(fsExtra.existsSync(DEFAULT_OUTPUT_DIR + path.sep + 'index.html')).toBeTruthy();
            expect(fsExtra.existsSync(DEFAULT_OUTPUT_DIR + path.sep + 'js' + path.sep + 'angular.min.js')).toBeTruthy();
            expect(fsExtra.existsSync(DEFAULT_OUTPUT_DIR + path.sep + 'js' + path.sep + 'angular-resource.min.js')).toBeTruthy();
            expect(fsExtra.existsSync(DEFAULT_OUTPUT_DIR + path.sep + 'js' + path.sep + '_ngApimock.js')).toBeTruthy();
            expect(fsExtra.existsSync(DEFAULT_OUTPUT_DIR + path.sep + 'js' + path.sep + 'ngapimock.component.js')).toBeTruthy();
            expect(fsExtra.existsSync(DEFAULT_OUTPUT_DIR + path.sep + 'js' + path.sep + 'ngapimock.controller.js')).toBeTruthy();
            expect(fsExtra.existsSync(DEFAULT_OUTPUT_DIR + path.sep + 'js' + path.sep + 'mocks.service.js')).toBeTruthy();
            expect(fsExtra.existsSync(DEFAULT_OUTPUT_DIR + path.sep + 'js' + path.sep + 'variables.service.js')).toBeTruthy();
            expect(fsExtra.existsSync(DEFAULT_OUTPUT_DIR + path.sep + 'css' + path.sep + 'main.css')).toBeTruthy();
            expect(fsExtra.existsSync(DEFAULT_OUTPUT_DIR + path.sep + 'protractor.mock.js')).toBeTruthy();
        }).catch(function () {
            expect('This test should fail').toBeNull();
        }).then(function () {
            done();
        });
    });

    it('should show warnings for duplicate mock identifiers', function (done) {
        ngApimock.run({
            src: 'test/mocks/error-duplicate'
        }).then(function () {
            expect(log.warn.length).toBe(1);
            expect(log.warn[0]['0']).toBe('Mock with identifier \'%s\' already exists. Overwriting existing mock.');
        }).catch(function () {
            // expect('This test should fail').toBeNull();
        }).then(function () {
            done();
        });
    });
});
})
();