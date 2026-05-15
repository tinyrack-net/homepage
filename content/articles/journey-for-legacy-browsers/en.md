---
title: "Journey for Legacy Browsers: Transpiling and Babel"
excerpt: "Methods to support legacy browsers"
lang: "en"
routeSlug: "journey-for-legacy-browsers"
translationKey: "journey-for-legacy-browsers"
publishedAt: "2021-09-11T00:00:00.000+00:00"
updatedAt: "2025-12-07T10:55:47.000+00:00"
tags: ["blog", "frontend"]
featureImage: "./images/feature-image.png"
commentsTerm: "journey-for-legacy-browsers"
draft: false
---

These days, there are very few users still using old browsers. Major browsers are highly optimized and support automatic updates, reducing the need to stick with outdated versions.

However, in many companies and government agencies in South Korea, the use of old browsers like Internet Explorer (IE) persists. For front-end developers tasked with supporting these environments, this can be quite challenging.

Writing JavaScript code that supports IE in 2024 is not easy. Modern syntax can be written in a single line, but the same functionality might require dozens of lines in older syntax.

Fortunately, developers around the world have already tackled this problem and created solutions. This article will explain methods to support legacy browsers through polyfills and transpiling, and introduce Babel, a tool that automates these processes.

---

## *Running Modern Code on Legacy Browsers*

First, let's look at what happens when you run normal, modern JavaScript code in IE. Here are some example codes and their results.

### Example 1

```javascript
alert('Hello, World!');
Object.assign({});
```

![](./images/object-assign-runtime-error.png)

### Example 2

```javascript
alert('Hello, World!');
async function a() {}
```

![](./images/async-function-syntax-error.png)

Both examples result in errors, but there is a significant difference between the two errors.

In Example 1, the alert is displayed, but the console shows an error indicating that the function does not exist. This means the code was parsed successfully, but an error occurred during execution because the function could not be found. This is called a runtime error.

In Example 2, the alert is not displayed, and the console shows a cryptic error. This indicates a failure during the parsing stage, preventing the code from executing at all. This is called a syntax error.

---

### *Fixing Example 1*

Let's look at how to fix each type of error. Example 1 can be easily resolved by defining the `Object.assign` function at the start of the code.

```javascript
if (!Object.prototype.entries) {
  Object.prototype.assign = function () {
    // Implementation code omitted
  };
}

alert('Hello, World!');
Object.assign({});
```

The important point here is that **the original code is not modified; something is just added at the beginning.** This method is known as a polyfill, implying "filling in the gaps."

### Fixing Example 2

For Example 2, the error occurs during the parsing stage, so a polyfill alone is insufficient. The original code must be transformed into syntax that the old browser can understand.

```javascript
alert('Hello, World!');
function a() {
  return new Promise(function(resolve) {
    resolve();
  });
}
```

The important point here is that **the original code is transformed into a form that the legacy browser can parse.** This method is called transpiling, implying "transforming."

In summary, supporting legacy browsers with modern JavaScript requires both appropriate polyfills and transpiling when polyfills alone are not enough.

Handling this manually for every piece of code and library used is impractical. This is where Babel comes into play.

---

## *Babel to the Rescue*

`Babel` is a tool designed to automate the polyfill and transpile processes. With Babel, developers can write code using the latest syntax, and Babel ensures the output works even on old browsers.

Let's follow Babel's [documentation](https://babeljs.io/docs/en/usage) to see how it transforms code.

> This section covers the usage of an older version of Babel. Focus on understanding the principles rather than the specific usage instructions.

### Babel's Polyfill

The documentation recommends adding the following libraries at the top of your code to make it compatible with IE's JavaScript engine.

```javascript
import "core-js/stable";
import "regenerator-runtime/runtime";
```

Previously, we discussed adding something at the beginning of the original code as a polyfill. `core-js` is a collection of various polyfills, pre-defining many modern ECMAScript standard functions that are not built into legacy JavaScript engines.

### Babel's Transpiling

We have already added `core-js` for polyfills, but Babel also suggests adding the `regenerator-runtime` library at the top of the project. Let's see why this is necessary by transforming a code example that cannot be fixed by polyfills alone.

#### Example

```javascript
async function a() {}
```

#### Transformed Code

```javascript
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function test() {
  return _test.apply(this, arguments);
}

function _test() {
  // ------------------------------------ Focus on this part ---------------------------------------
  _test = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _test.apply(this, arguments);
}
```

The result looks complex, but the key point is that the `async` code has been transformed to reference `regeneratorRuntime`.

Thus, Babel transpiles asynchronous code using the `regenerator-runtime` library, which is why this library must also be included at the top of the code.

In summary, Babel uses `core-js` for polyfills and `regenerator-runtime` for transpiling. This allows modern syntax to be converted into code that works on legacy browsers.

---

## The Limitations of Babel

Once Babel is set up, it might seem like your code will work perfectly on old browsers. However, this is not always the case. Let's look at situations where `core-js` and `regenerator-runtime` might not be enough.

### The Limitations of `core-js`

First, `core-js` only includes ECMAScript standard functions. ECMAScript defines only language-level features, meaning it does not cover browser-specific APIs.

For example, the `ResizeObserver` API is not part of the ECMAScript standard and is thus not included in `core-js`.

To use such APIs, you need to include third-party polyfills or write them yourself. Developers must carefully verify whether the APIs they use are part of the ECMAScript standard or specific to browsers. Missing a polyfill can cause your app to suddenly stop working on legacy browsers.

### The Limitations of `regenerator-runtime`

While Babel supports most modern JavaScript syntax, it does not officially support Stage 3 or lower proposals in the ECMAScript standard.

Notable examples include `Metadata` and `Decorator`, which are widely used due to the popularity of TypeScript. Here is an example of decorator syntax:

```javascript
@annotation
class MyClass {
  constructor() {
    this.name = name;
  }
}
```

To use these in Babel, you need to install third-party plugins. As JavaScript continues to evolve, developers must ensure that the syntax they use can be processed by Babel.

### What About HTML and CSS?

Finally, Babel is a tool for JavaScript. But web services are not just JavaScript. Once JavaScript issues are resolved, HTML and CSS issues remain. Are there similar tools for these?

Unfortunately, tools for HTML and CSS are not as developed as Babel. `lightningcss` and `postcss` exist for CSS, but they are not as convenient as Babel, and there is no equivalent for HTML. Developers must write HTML and CSS with legacy browser compatibility in mind from the start.

---

## When Will Internet Explorer Disappear?

We've explored methods and challenges in supporting legacy browsers. To conclude, here are my thoughts on when Internet Explorer might finally disappear.

When I was discharged from the army in 2018, the standard browser in the military was IE8. It seems unbelievable now, but all military systems were built on ActiveX technology, making it difficult to transition.

Microsoft has announced that IE will be removed from Windows 11. This news was welcomed by many, but similar announcements were made with the release of Windows 10.

When Windows 10 was released,

Microsoft downgraded IE to a "support" program and introduced Edge. Despite this, IE continued to be used. Windows 11 will still offer IE compatibility mode in Edge, so I expect IE usage to persist.

I predict that IE might be phased out in enterprises and government agencies around 2040, but even this is uncertain due to the inertia of organizational systems. Microsoft has promised to support IE compatibility mode until at least 2029.

Supporting old browsers is always painful for developers, and I hope IE will be phased out soon. But whether that day will ever come remains to be seen.
