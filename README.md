# PAGE.js

### Legend
+ [Why](#why)
+ [Usage](#usage)
+ [Methodology](#methodology)
+ [Extending](#extending)

## Why
Page.js is a humble attempt at organizing JavaScript loaded onto a page into logical groups that cannot conflict. 

Because there are many different ways writing javascript, often there are many different approaches to declaring variables on a page. Since the `Window` object is the location for all global variables, it can be difficult to find your way when working with code you've never seen before.

As a demonstration, open up your `console` , preferably in chrome, and type `window`. Once you expand this, you will see hundreds and hundreds of variables.

Often variables will be defined at all different places inside a HTML file, or the many javascript files linked to it. and often they will reference other variables that are likewise scattered.  This is a messy style to inherit and is quite dangerous since it is too easy to overide a variable and break code.

What PAGE does is declares a single global variable, that your app can store everything in and access everything asyncrhonously. The method to add and retrieve from this global variable are standardized into either an asynchronous or synchronous return. Once the *Constructor* - or - *Object* - or - *Function* is avaialable, it calls back and returns it.

Much like jQuery has the `$(document).ready` method, PAGE has the `PAGE.wait` mehtod. Only PAGE can load anything you feed it.

## Usage
##### Achieving an organized APP
Think of your app as some version of the following data structure.
```
PAGE = {
    Constructors : {}
    , Functions : {}
    , Modules : {}
    . Properties : {}
}
```

### Constructors
What are Constructors? Constructors are functions that produce Objects (we'll call them Modules from now on). These Modules have methods, properties, and intereactions with other Modules and Properties. For simplicity sake, think of Constructors as the basis of all Modules. This is a one to many relationship, one Constructor can make many Modules.

### Modules
Modules are alive! They mutate, grow, shrink, and interact with your app. There can be no APP without Modules , but there can be an APP without Constructors.

In my practice I tend to keep Modules as `Singletons` that have a bunch of different methods or properties that are instances of `Constructors`. Though, one could choose to write Modules as instances of Constructors just as easily.

### Functions
Sometimes you need a simple function that will do some common work to data or DOM elements which does not mutate, nor need multiple instances.

### Properties
These are often the Global Properties of a page, say the `Data` that is needed by the Modules. Always refrenced by Modules, never by Constructors.

## How they work together

##### to Create a Constructor
```JavaScript
PAGE.add("Constructors.SomeWidget", function($ele, options) {
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
        someWidget : undefined /* SomeWidget */
        , $ele : $("#button1")
    }
    function init() {
        PAGE.wait("Constructors.SomeWidget", function(SomeWidget) {
            dog.someWidget = SomeWidget(dog.$ele, { setting1 : true })
        })
    }
    init()
    return dog
}()))
```
##### to Create a Module (non Singleton version)
```JavaScript
PAGE.wait("Constructors.SomeWidget", function(SomeWidget) {
    PAGE.add$("Modules.example", SomeWidget($("#button")))
})
```


### Some explanation
`PAGE.add$` calls back once jQuery is loaded.

`PAGE.wait(location, callback)` waits for whatever is being passed into the first parameter, then calls back with the thing.




## Methodology

## Extensions



Play around with the demo on a localhost box, open up the console and type PAGE. You will see something like this.

![google console](http://www.mangoroom.com/work/example-console.png)

This shows everything that has been loaded to the PAGE.
