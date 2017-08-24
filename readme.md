# can-construct-proxy (DEPRECATED)

[![Greenkeeper badge](https://badges.greenkeeper.io/canjs/can-construct-proxy.svg)](https://greenkeeper.io/)

*The can-construct-proxy has been deprecated. See [can.proxy](https://canjs.com/docs/can.proxy.html) to proxy callbacks outside of `can.Construct`s*

[![Build Status](https://travis-ci.org/canjs/can-construct-proxy.png?branch=master)](https://travis-ci.org/canjs/can-construct-proxy)

`can-construct-proxy` is a [CanJS](http://canjs.com/docs) Plugin that creates callback functions that have `this` set correctly.

It can:

- Partially apply parameters
- Pipe callbacks and curry arguments
- Enable usage of `proxy` on constructors

## Overview

The `can-construct-proxy` plugin adds a `proxy` method to [can.Construct](canjs.com/docs/can.Construct.html), which creates a callback function that have `this` set to an instance of the constructor function. For example:

```
var Animal = can.Construct.extend({
    init: function(name) {
        this.name = name;
    },
    speak: function (words) {
        console.log(this.name + ' says: ' + words);
    }
});

var dog = new Animal("Gertrude");

// Passing a function
var dogDance = dog.proxy(function(dance){
    console.log(this.name + ' loves dancing the ' + dance);
});
dogDance('hokey pokey'); // Gertrude loves dancing the hokey pokey
```

### Partially Applying Parameters

If you pass more than one parameter to `proxy`, the additional parameters will
be passed as parameters to the callback before any parameters passed to the
proxied function.

Here is a simple example of this:

```
var Animal = can.Construct.extend({
    init: function(name) {
        this.name = name;
    }
});
var dog = new Animal("Gertrude");

var func = function(feeling, thing){
    console.log(this.name + ' ' + feeling + ' ' + thing);
};

// Passing one argument (partial application)
var dogLoves = dog.proxy(func, 'loves');
dogLoves('cupcakes!'); // Gertrude loves cupcakes!
```

### Piping Callbacks and Currying Arguments

If you pass an array of functions and strings as the first parameter to `proxy`, `proxy` will call the callbacks in sequence, passing the return value of each
as a parameter to the next. This is useful to avoid having to curry callbacks.

Here's a simple example of this:

```
var Animal = can.Construct.extend({});
var dog = new Animal();

// Passing an array of functions
var dogCount = dog.proxy([
    function (start){
        console.log(start);
        return [start, start + 1];
    },
    function(start, next) {
        console.log(start + ' ' + next);
        return [start, next, next + 1];
    },
    function(start, next, last) {
        console.log(start + ' ' + next + ' ' + last);
    }
]);

dogCount(3); // 3, 3 4, 3 4 5
```

### `proxy` on Constructors

can.Construct.proxy also adds `proxy` to the constructor, so you can use it
in static functions with the constructor as `this`.

Here's a counter construct that keeps its count staticly and increments after one second:

```
var DelayedStaticCounter = can.Construct.extend({
    setup: function() {
        this.count = 0;
    }
    incrementSoon: function() {
        setTimeout(this.proxy(function() {
            this.count++;
        }), 1000);
    }
}, {});

DelayedStaticCounter.incrementSoon();
```

## API Reference

### `can.Construct.proxy(callback, [...args])`

Creates a static callback function that has `this` set to an instance of the constructor function.

#### Params

##### `{Function|String|Array.<Function|String>}` callback

Function or functions to proxy

Passing a single function returns a function bound to the constructor.
```
var Animal = can.Construct.extend({
    init: function(name) {
        this.name = name;
    },
    speak: function (words) {
        console.log(this.name + ' says: ' + words);
    }
});

var dog = new Animal("Gertrude");

// Passing a function
var dogDance = dog.proxy(function(dance){
    console.log(this.name + ' loves dancing the ' + dance);
});
dogDance('hokey pokey'); // Gertrude loves dancing the hokey pokey
```

Passing an array of functions returns a function that when executed will call the functions in order applying the returned values from the previous function onto the next function.
```
// Passing an array of functions
var dogCount = dog.proxy([
    function (start){
        console.log(start);
        return [start, start + 1];
    },
    function(start, next) {
        console.log(start + ' ' + next);
        return [start, next, next + 1];
    },
    function(start, next, last) {
        console.log(start + ' ' + next + ' ' + last);
    }
]);

dogCount(3); // 3, 3 4, 3 4 5
```

In either case a string can be passed instead of a function and this will be used to look the function up on the constructor.

```
var dogTalk = dog.proxy('speak');
dogTalk('This is crAAaaaaAAzzzyyy'); // Gertrude says: This is crAAaaaaAAzzzyyy
```

##### `{*}` args
Continuing from the example above:

```
var func = function(feeling, thing){
    console.log(this.name + ' ' + feeling + ' ' + thing);
};
// Passing one argument (partial application)
var dogLoves = dog.proxy(func, 'loves');
dogLoves('cupcakes!'); // Gertrude loves cupcakes!

// Passing many arguments
var dogHateUnicorns = dog.proxy(func, 'hates', 'unicorns');
dogHateUnicorns(); // Gertrude hates unicorns
```

#### Return

##### `{Function}`

A function that calls `callback` with the same context as the current context.

## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'can-construct-proxy';
```

### CommonJS use

Use `require` to load `can-construct-proxy` and everything else
needed to create a template that uses `can-construct-proxy`:

```js
var plugin = require("can-construct-proxy");
```

## AMD use

Configure the `can` and `jquery` paths and the `can-construct-proxy` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'can-construct-proxy',
		    	location: 'node_modules/can-construct-proxy/dist/amd',
		    	main: 'lib/can-construct-proxy'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-construct-proxy/dist/global/can-construct-proxy.js'></script>
```

## Making Changes

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
