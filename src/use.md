@page usage Usage
@parent can-construct-proxy

## Partially applying parameters

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

## Piping callbacks and currying arguments

If you pass an array of functions and strings as the first parameter to `proxy`,
`proxy` will call the callbacks in sequence, passing the return value of each
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

## `proxy` on constructors

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

## See also

[can.proxy](https://canjs.com/docs/can.proxy.html) is a way to proxy callbacks outside of `can.Construct`s.
