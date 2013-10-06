# PAGE.js

### Legend
+ [Why](#why)
+ [Usage](#usage)
+ [Methodology](#methodology)
+ [Extensions](#extensions)

## Why
Page.js is a humble attempt at organizing JavaScript loaded onto a page into logical groups that cannot conflict. 

Because there are many different ways writing javascript, often there are many different approaches to declaring variables on a page. Since the `Window` object is the location for all global variables, it can be difficult to find your way when working with code you've never seen before.

As a demonstration, open up your `console` , preferably in chrome, and type `window`. Once you expand this, you will see hundreds and hundreds of variables.

What PAGE does is declares a single global variable, whereby all other variables get passed into. The method to add and retrieve from this global variable are standardized in an asynchronous way. Once the *Constructor* - or - *Object* - or - *Function* are loaded, it calls back and returns it.

Much like jQuery has the `$(document).ready` method, PAGE has the `PAGE.wait` mehtod. Only PAGE can load anything you feed it. 

#### Organize your APP
```
// Think of your app structured like this

var myApp = {
    Constructors : {}
    , Functions : {}
    , Modules : {}
    . Properties : {}
}
```

## Constructors
What are Constructors? Constructors are functions that produce Objects (we'll call them Modules from now on). These Modules have methods, properties, and intereactions with other Modules and Properties. For simplicity sake, think of Constructors are basis of all Modules. This is a one to many relationship, one Constructor can make many Modules.

## Modules
Modules are the `instance` of the Constructor. Modules are alive! They mutate, they change all around, they grow, shrink, and interact. They need Constructors to generate parts of themselves.

## Functions
Sometimes you need a function that will do some common work in your module or constructor.

## Properties
These are often the Global Properties of a page, say the `Data` that gets passed into the Module.

Often variables will be defined at all different places inside a HTML file, or the many javascript files linked to it. and often they will reference other variables that are likewise scattered.  This is a messy style to inherit and is quite dangerous since it is too easy to overide a variable and break code.  

Page.js fixes this by giving your 'Page' a central single variable to put all your stuff in, while still maintaining the flexibility of locally scoped variables. This is not a jQuery type of library, it's for people who know how to code javaScript well but just want a way to organize it better. 

This code is part of of the greater 'dogstyle' movement with the goal of simplifying and clarifying raw javascript code. The dog style, or dog "pattern" is a practical way of writing JavaScript (EcmaScript) that affords clean modular coding practices making it easy for others to read and adapt. This style of writing code takes advantage of Javascript's scoping, and allows you to develop code in tandem with Chrome's console to rapidly build pages in a testable way.
## Usage

## Methodology

## Extensions



Play around with the demo on a localhost box, open up the console and type PAGE. You will see something like this.

![google console](http://www.mangoroom.com/work/example-console.png)

This shows everything that has been loaded to the PAGE.
