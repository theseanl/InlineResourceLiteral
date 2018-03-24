# InlineResourceLiteral

[![NPM Version](https://img.shields.io/npm/v/inline-resource-literal.svg?style=plastic)](https://npmjs.org/package/inline-resource-literal)

InlineResource is a Javascript build tool that handles inlining of common types of resources with a declarative syntax. It provides an ability to replace pre-defined placeholders into JS expressions at build time. It automatically minifies files with extension `html` and `css`.

## Installation

Add InlineResource to your project's devDependency by executing:
```
yarn add inline-resource-literal --dev
```

## Usage

```js
// source.js
...
element.innerHTML = RESOURCE_TEMPLATE;
...
```
```html
// template.html
<html><div></div></html>
```
```js
// build.js
const InlineResource = require("inline-resource-literal");
const fs = require('fs');

const file = fs.readFileSync('./source.js').toString();

const inlined = (new InlineResource({
    "TEMPLATE": './template.html'
})).inline(file);

fs.writeFileSync('./inlined.js', inlined);
```
```js
// inlined.js
element.innerHTML = "<div></div>";
```

### Inlining with Precomputed Values

```js
// source.js
element.innerHTML = RESOURCE_ARGS("TEMPLATE", "DOMAIN", document.domain, "LANGUAGE", navigator.language);
```
```html
// template.html
<p>domain is: RESOURCE_DOMAIN</p>
<p>language is: RESOURCE_LANGUAGE</p>
```
```js
// build.js
const InlineResource = require("inline-resource-literal");
const fs = require('fs');

const file = fs.readFileSync('./source.js').toString();

const inlined = (new InlineResource({
    "TEMPLATE": './template.html'
})).inline(file);

fs.writeFileSync('./inlined.js', inlined);
```
```js
// inlined.js
element.innerHTML = "<p>domain is: " + document.domain + "</p>\n<p>language is: " + navigator.language + "</p>";
```

## API

Check out the [`.d.ts` file](https://github.com/seanl-adg/InlineResourceLiteral/blob/master/index.d.ts).
