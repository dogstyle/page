Page.js is a developer's attempt at organizing JavaScript loaded on a page into logical groups.  As someone who has worked in the trenches of statup life for a decade, I have seen many patterns and code practices.  This is especially true in JavaScript because of how flexible and expressive a language it is.  Often variables will be defined at all different places inside the HTML file, and often they will reference other variables that are likewise scattered.  This is a messy style to inherit and is quite dangerous since it is too easy to overide a variable and break code.  

Page.js fixes this by giving your 'Page' a central single variable to put all your stuff in, while still maintaining the flexibility of locally scoped variables. This is not a jQuery type of library, it's for people who know how to code javaScript well but just want a way to organize it better. 

This code is part of of the greater 'dogstyle' movement with the goal of simplifying and clarifying raw javascript code. The dog style, or dog "pattern" is a practical way of writing JavaScript (EcmaScript) that affords clean modular coding practices making it easy for others to read and adapt. This style of writing code takes advantage of Javascript's scoping, and allows you to develop code in tandem with Chrome's console to rapidly build pages in a testable way.

Play around with the demo on a localhost box, open up the console and type PAGE. You will see something like this.

![google console](http://www.mangoroom.com/work/example-console.png)

This shows everything that has been loaded to the PAGE.
