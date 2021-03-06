/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:cli:ignore
 * @fileoverview Find mdast ignore files.
 */

'use strict';

/*
 * Dependencies.
 */

var fs = require('fs');
var path = require('path');
var debug = require('debug')('mdast:cli:ignore');
var Finder = require('./finder');

/*
 * Constants.
 */

var IGNORE_NAME = '.mdastignore';

var defaults = [
    'node_modules/'
];

/*
 * Methods.
 */

var read = fs.readFileSync;
var resolve = path.resolve;
var has = Object.prototype.hasOwnProperty;

/**
 * Check if a pattern-like line is an applicable pattern.
 *
 * @example
 *   isApplicable('node_modules'); // true
 *   isApplicable(' #node_modules'); // false
 *
 * @param {string} value
 * @return {boolean}
 */
function isApplicable(value) {
    var line = value && value.trim();

    return line && line.length && line.charAt(0) !== '#';
}

/**
 * Parse an ignore file.
 *
 * @example
 *   var ignore = load('~/.mdastignore');
 *
 * @throws {Error} - Throws when `filePath` is not found.
 * @param {string} filePath - File location.
 * @return {Object} - List of applicable patterns.
 */
function load(filePath) {
    var ignore = {};

    if (filePath) {
        try {
            ignore = read(filePath, 'utf8');

            ignore = ignore.split(/\r?\n/).filter(isApplicable);
        } catch (exception) {
            exception.message = 'Cannot read ignore file: ' +
                filePath + '\n' + 'Error: ' + exception.message;

            throw exception;
        }
    }

    return ignore;
}

/**
 * Find ignore-patterns.
 *
 * @example
 *   var ignore = new Ignore({
 *     'file': '.gitignore'
 *   });
 *
 * @constructor
 * @class {Ignore}
 * @param {Object?} [options]
 */
function Ignore(options) {
    var self = this;
    var settings = options || {};
    var file = settings.file;

    self.cache = {};
    self.cwd = options.cwd || process.cwd();
    self.finder = new Finder([IGNORE_NAME], self.cwd);

    self.detectIgnore = settings.detectIgnore;

    if (file) {
        debug('Using command line ignore `' + file + '`');

        self.cliIgnore = load(resolve(self.cwd, file));
    }
}

/**
 * Get patterns belonging to `filePath`.
 *
 * @example
 *   var ignore = new Ignore();
 *   var patterns = ignore();
 *
 * @this {Ignore}
 * @param {string?} [filePath] - Path to file, defaults to
 *   current working directory.
 * @return {Array.<string>} - Array of ignored paths.
 */
function getPatterns(filePath) {
    var self = this;
    var directory = filePath ? path.dirname(filePath) : self.cwd;
    var ignore = self.cache[directory];

    debug('Constructing ignore for `' + (filePath || self.cwd) + '`');

    if (self.cliIgnore) {
        debug('Using ignore form CLI');

        ignore = self.cliIgnore.concat(self.defaults);
    } else if (!self.detectIgnore) {
        ignore = self.defaults;
    } else if (!has.call(self.cache, directory)) {
        ignore = self.finder.find(directory, true);

        ignore = (ignore ? load(ignore) : []).concat(self.defaults);

        self.cache[directory] = ignore;
    } else {
        debug('Using ignore from cache');

        ignore = self.cache[directory];
    }

    return ignore;
}

/*
 * Expose methods.
 */

Ignore.prototype.getPatterns = getPatterns;

/*
 * Expose defaults.
 */

Ignore.prototype.defaults = defaults;

/*
 * Expose.
 */

module.exports = Ignore;
