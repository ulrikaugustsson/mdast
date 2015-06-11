# ![mdast](https://cdn.rawgit.com/wooorm/mdast/master/logo.svg)

[![Build Status](https://img.shields.io/travis/wooorm/mdast.svg?style=flat)](https://travis-ci.org/wooorm/mdast) [![Coverage Status](https://img.shields.io/coveralls/wooorm/mdast.svg?style=flat)](https://coveralls.io/r/wooorm/mdast?branch=master)

**mdast** is a markdown processor powered by plugins. Lots of tests. Node,
io.js, and the browser. 100% coverage.

**mdast** is not just another markdown to HTML compiler. It can generate,
and reformat, markdown too. It’s powered by [plugins](doc/plugins.md) to do
all kinds of things: [change a readme.md](https://github.com/wooorm/mdast-usage),
[lint JavaScript in your markdown](https://github.com/wooorm/eslint-md), or
[add a table of contents](https://github.com/wooorm/mdast-toc).

## Table of Contents

*   [Installation](#installation)

*   [Usage](#usage)

*   [API](#api)

    *   [mdast.process(value, options?, done?)](#mdastprocessvalue-options-done)
    *   [mdast.use(plugin, options?)](#mdastuseplugin-options)

*   [CLI](#cli)

*   [Benchmark](#benchmark)

*   [License](#license)

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install mdast
```

[Component.js](https://github.com/componentjs/component):

```bash
component install wooorm/mdast
```

[Bower](http://bower.io/#install-packages):

```bash
bower install mdast
```

[Duo](http://duojs.org/#getting-started):

```javascript
var mdast = require('wooorm/mdast');
```

UMD (globals/AMD/CommonJS) ([uncompressed](mdast.js) and
[compressed](mdast.min.js)):

```html
<script src="path/to/mdast.js" charset="utf-8"></script>
<script>
    mdast.process('*hello* __world__'); // _hello_ **world**
</script>
```

## Usage

```javascript
var mdast = require('mdast');
var yamlConfig = require('mdast-yaml-config');
```

Use a plugin. mdast-yaml-config allows settings in YAML frontmatter.

```javascript
var processor = mdast().use(yamlConfig);
```

Parse, modify, and stringify the document:

```javascript
var doc = processor.process(
    '---\n' +
    'mdast:\n' +
    '  commonmark: true\n' +
    '---\n' +
    '\n' +
    '2) Some *emphasis*, **strongness**, and `code`.\n'
);
```

Yields:

```markdown
---
mdast:
  commonmark: true
---

2.  Some _emphasis_, **strongness**, and `code`.
```

## API

This section only covers the interface you’ll use most often. See
[mdast(3) documentation](doc/mdast.3.md) for a more complete description:

*   [mdast.parse(file, options?)](doc/mdast.3.md#mdastparsefile-options)
    — Parses markdown into an abstract syntax tree;

*   [mdast.run(ast, file, done?)](doc/mdast.3.md#mdastrunast-file-done)
    — Applies plugins to the syntax tree;

*   [mdast.stringify(ast, options?)](doc/mdast.3.md#mdaststringifyast-options)
    — Compiles the syntax tree into a string;

*   [mdast.process(file, options?, done?)](doc/mdast.3.md#mdastprocessfile-options-done)
    — More detailed than [below](#mdastprocessvalue-options-done);

*   [mdast.use(plugin, options?)](doc/mdast.3.md#mdastuseplugin-options)
    — More detailed than [below](#mdastuseplugin-options);

*   [function done(err?, doc?, file?)](doc/mdast.3.md#function-doneerr-doc-file)
    — Callback passed to `run()` and `process()`.

*   [File()](doc/mdast.3.md#file)
    — Wrapper around (virtual) files.

### [mdast](#api).process(value, [options](doc/options.md)?, done?)

Parse a markdown document, apply plugins to it, and compile it into
something else.

**Signatures**

*   `doc = mdast.process(value, options?, done?)`.

**Parameters**

*   `value` (`string`) — Markdown document;

*   `options` (`Object`) — Settings:

    *   `gfm` (`boolean`, default: `true`) — See [Github Flavoured Markdown](doc/options.md#github-flavoured-markdown);
    *   `yaml` (`boolean`, default: `true`) — See [YAML](doc/options.md#yaml);
    *   `commonmark` (`boolean`, default: `false`) — See [CommonMark](doc/options.md#commonmark);
    *   `footnotes` (`boolean`, default: `false`) — See [Footnotes](doc/options.md#footnotes);
    *   `pedantic` (`boolean`, default: `false`) — See [Pedantic](doc/options.md#pedantic);
    *   `breaks` (`boolean`, default: `false`) — See [Breaks](doc/options.md#breaks);
    *   `entities` (`boolean`, default: `false`) — See [Encoding Entities](doc/options.md#encoding-entities);
    *   `setext` (`boolean`, default: `false`) — See [Setext Headings](doc/options.md#setext-headings);
    *   `closeAtx` (`boolean`, default: `false`) — See [Closed ATX Headings](doc/options.md#closed-atx-headings);
    *   `looseTable` (`boolean`, default: `false`) — See [Loose Tables](doc/options.md#loose-tables);
    *   `spacedTable` (`boolean`, default: `true`) — See [Spaced Tables](doc/options.md#spaced-tables);
    *   `fence` (`"~"` or ``"`"``, default: ``"`"``) — See [Fence](doc/options.md#fence);
    *   `fences` (`boolean`, default: `false`) — See [Fences](doc/options.md#fences);
    *   `bullet` (`"-"`, `"*"`, or `"+"`, default: `"-"`) — See [List Item Bullets](doc/options.md#list-item-bullets);
    *   `incrementListMarker` (`boolean`, default: `true`) — See [List Marker Increase](doc/options.md#list-marker-increasement);
    *   `rule` (`"-"`, `"*"`, or `"_"`, default: `"*"`) — See [Horizontal Rules](doc/options.md#horizontal-rules);
    *   `ruleRepetition` (`number`, default: `3`) — See [Horizontal Rules](doc/options.md#horizontal-rules);
    *   `ruleSpaces` (`boolean`, default `true`) — See [Horizontal Rules](doc/options.md#horizontal-rules);
    *   `strong` (`"_"`, or `"*"`, default `"*"`) — See [Emphasis Markers](doc/options.md#emphasis-markers);
    *   `emphasis` (`"_"`, or `"*"`, default `"_"`) — See [Emphasis Markers](doc/options.md#emphasis-markers).

*   `done` (`function(Error?, string?)`) — Callback invoked when the output
    is generated with either an error, or a result. Only strictly needed when
    async plugins are used.

All options (including the options object itself) can be `null` or `undefined`
to default to their default values.

**Returns**

`string` or `null`: A document. Formatted in markdown by default, or in
whatever a plugin generates.
The result is `null` if a plugin is asynchronous, in which case the callback
`done` should’ve been passed (don’t worry: plugin creators make sure you know
    its async).

### [mdast](#api).use([plugin](doc/plugins.md#plugin), options?)

Change the way [`mdast`](#api) works by using a [`plugin`](doc/plugins.md).

**Signatures**

*   `processor = mdast.use(plugin, options?)`;
*   `processor = mdast.use(plugins)`.

**Parameters**

*   `plugin` (`Function`) — A [**Plugin**](doc/plugins.md);

*   `plugins` (`Array.<Function>`) — A list of [**Plugin**](doc/plugins.md)s;

*   `options` (`Object?`) — Passed to the plugin. Specified by its
    documentation.

**Returns**

`Object`: an instance of MDAST: The returned object functions just like
**mdast** (it has the same methods), but caches the `use`d plugins. This
provides the ability to chain `use` calls to use multiple plugins, but
ensures the functioning of the **mdast** module does not change for other
dependents.

## CLI

Install:

```bash
npm install --global mdast
```

Use:

```text
Usage: mdast [options] file|dir ...

Markdown processor powered by plugins

Options:

  -h, --help                output usage information
  -V, --version             output the version number
  -o, --output [path]       specify output location
  -c, --config-path <path>  specify configuration location
  -i, --ignore-path <path>  specify ignore location
  -s, --setting <settings>  specify settings
  -u, --use <plugins>       use transform plugin(s)
  -e, --ext <extensions>    specify extensions
  -a, --ast                 output AST information
  -q, --quiet               output only warnings and errors
  -S, --silent              output only errors
  --file-path <path>        specify file path to process as
  --no-color                disable color in output
  --no-rc                   disable configuration from .mdastrc
  --no-ignore               disable ignore from .mdastignore

Usage:

# Pass `readme.md` through mdast
$ mdast readme.md -o readme-new.md

# Pass stdin through mdast, with settings, to stdout
$ cat readme.md | mdast -s "setext: true, bullet: "*"" > readme-new.md

# Use a plugin (with options)
$ npm install mdast-toc
$ mdast --use toc=heading:"contents" readme.md -o

# Rewrite markdown in a directory
$ mdast . -o

See also:

man 1 mdast, man 3 mdast, man 5 mdastrc, man 5 mdastignore, man 7 mdastconfig
```

## Benchmark

On a MacBook Air, it parses ± 322Kb of markdown (in 214 documents) per second.

```text
          214 fixtures (total: 80.62Kb)
   4 op/s » mdast.parse w/ `gfm: true`, and `yaml: true`
  69 op/s » mdast.stringify w/ `gfm: true`, and `yaml: true`
   4 op/s » mdast.parse w/ `gfm: false`, and `yaml: false`
  70 op/s » mdast.stringify w/ `gfm: false`, and `yaml: false`
   4 op/s » mdast.parse w/ `gfm: true`, `yaml: true`, and `commonmark: true`
  72 op/s » mdast.stringify w/ `gfm: true`, `yaml: true`, and `commonmark: true`
```

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)

> This project was initially a fork of [marked](https://github.com/chjj/marked).

Copyright (c) 2011-2014, Christopher Jeffrey. (MIT License)