@page api API Reference
@parent can-construct-proxy
@test can/construct/proxy/test.html
@download http://donejs.com/can/dist/can.construct.proxy.js

@description Creates callback functions that have `this` set correctly.

@signature `can.Construct.proxy(callback, [...args])`

Creates a static callback function that has `this` set to an instance of the constructor
function.

@param {Function|String|Array.<Function|String>} callback 
The function or functions to proxy.

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

In either case a string can be passed instead of a function and this will be used to look the function up on the constructor

```
var dogTalk = dog.proxy('speak');
dogTalk('This is crAAaaaaAAzzzyyy'); // Gertrude says: This is crAAaaaaAAzzzyyy
```

@param {*} args Any number of arguments to be partially applied to the first function.
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
@return {Function} a function that calls `callback` with the same context as the current context