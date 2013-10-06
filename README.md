# PAGE.js

### Legend
+ [Why](#why)
+ [An Organized PAGE](#an-organized-page)
+ [Constructors](#constructors)
+ [Modules](#modules)
+ [Functions](#functions)
+ [Properties](#properties)
+ [How they work together](#how-they-work-together)
+ [Create Constructor](#to-create-a-constructor)
+ [Create Module](#to-create-a-constructor)
+ [Debugging Made Easy](#debugging-made-easy)
+ [Extending](#extending)

## Why
Page.js is a humble attempt at organizing JavaScript loaded onto a page into logical groups that cannot conflict. 

Because there are many different ways writing javascript, often there are many different approaches to declaring variables on a page. Since the `Window` object is the location for all global variables, it can be difficult to find your way when working with code you've never seen before.

As a demonstration, open up your `console` , preferably in chrome, and type `window`. Once you expand this, you will see hundreds and hundreds of variables.

Often variables will be defined at all different places inside a HTML file, or the many javascript files linked to it. and often they will reference other variables that are likewise scattered.  This is a messy style to inherit and is quite dangerous since it is too easy to overide a variable and break code.

What PAGE does is declares a single global variable, that your app can store everything in and access everything asyncrhonously. The method to add and retrieve from this global variable are standardized into either an asynchronous or synchronous return. Once the *Constructor* - or - *Object* - or - *Function* is avaialable, it calls back and returns it.

Much like jQuery has the `$(document).ready` method, PAGE has the `PAGE.wait` mehtod. Only PAGE can load anything you feed it.

#### An Organized PAGE
```
PAGE = {
    Constructors : {}
    , Functions : {}
    , Modules : {}
    . Properties : {}
}
```

## Constructors
What are Constructors? Constructors are functions that produce Objects (we'll call them Modules from now on). These Modules have methods, properties, and intereactions with other Modules and Properties. For simplicity sake, think of Constructors as the basis of all Modules. This is a one to many relationship, one Constructor can make many Modules.

## Modules
Modules are `Singleton`'s

Modules are alive! They mutate, grow, shrink, and interact with your app. There can be no APP without Modules. But there can be an APP without Constructors.

In my practice I tend to keep Modules as `Singletons` that have a bunch of different methods or properties that are instances of `Constructors` or `Functions`. Though, one could choose to write Modules as instances of Constructors just as easy.

## Functions
Sometimes you need a simple function that will do some common work to data or DOM elements which does not mutate, nor need multiple instances.

## Properties
These are often the Global Properties of a page, say the `Data` that is needed by the Modules. Always refrenced by Modules, never by Constructors.

## How they work together

##### to Create a Constructor
```JavaScript
PAGE.add("Constructors.ExampleCons", function($ele, options) {
    options = options || {}
    var dog = {
        $elem : $elem
        , someMethod : function() { return this }
        , options : options
    }
    return dog
})
```
##### to Create a Module
```JavaScript
PAGE.add$("Modules.homePage", (function() {
    var dog = {
        exampleCons : undefined /* ExampleCons */
        , $ele : $("#button1")
    }
    function init() {
        PAGE.wait("Constructors.ExampleCons", function(ExampleCons) {
            dog.exampleCons = ExampleCons(dog.$ele, { setting1 : true })
        })
    }
    init()
    return dog
}()))
```
##### to Create a Module (non Singleton version)
```JavaScript
PAGE.wait("Constructors.ExampleCons", function(ExampleCons) {
    PAGE.add$("Modules.exampleCons", ExampleCons($("#button")))
})
```

### Some explanation
`PAGE.add$` calls back once jQuery is loaded

`PAGE.wait(location, callback)` waits for whatever is being passed into the first parameter, then calls back with the thing.

## Debugging made easy
Download the demo to a localhost box, open up the console and type PAGE. You will see something like this.
![google console](http://www.mangoroom.com/work/example-console.png)
This shows everything that has been loaded into the PAGE object.


## Extending
By itself PAGE is rather low level and primitive. It's not an ajax library or anything fancy like that.
It's most basic and important role is to organize everything inside your app into an easy to navigate single variable that you can explore with the console tool. 

That being said, there are already many Extensions that can be added to PAGE to support greater ability beyond
Constructors. Extensions can mutate the prototype of PAGE itself, or add functionality to it. One shining example of this is `test`. By having a consistent set of methods to add and retrieve from the PAGE object, cool possibilities open up. One of these is automated testing. with `test` added to your project, running tests is as simple as calling `PAGE.runAllTests()` in your console.
