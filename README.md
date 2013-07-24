Page.js is a developer's attempt at organizing JavaScript loaded on a page into logical groups.
As someone who has worked in the trenches of statup life for a decade, I have seen many patterns and code practices. 
This is especially true in JavaScript because of how flexible and expressive a language it is. 
Often variables will be defined all over the place, and will be refrenced again in code. 
This is a dangerous practice since it is too easy to overide a variable and break code.
Also this is a confusing practice for someone wanting to work on your code long after you've gone. 

Page.js fixes all that by giving your 'Page' a central single variable to put all your stuff. This code
is part of of the greater 'dogstyle' movement with the goal of simplifying and clarifying raw javascript code.

The dog style, or dog "pattern" is a practical way of writing JavaScript (EcmaScript) 
that affords clean modular coding practices making it easy for others to read and adapt. This style
of writing code takes advantage of Javascript's scoping, and allows you to develop code in tandem with
Chrome's console to rapidly build pages in a testable way.

Here is a basic example of dog styled 'constructor'.

```JavaScript

function SomeModule($obj, options) {

  options = options || { }
  options.someOption = options.someOption || 42

  var dog = {
    options : options
    , $obj : $obj
    , $someThingCool : undefined
  }
  
  function events() {
    dog.$someThingCool.click(function() {
      console.log("you just clicked me")
    })
  }
  
  function init() {
    dog.$someThingCool = $obj.find(".somethingCool")
  }
  
  init()
  
  return dog
}
```

Now that you've created your 'Module' you can load it onto your page either at the $(document).ready,
or within other Modules.

Example on page level

```JavaScript

$(document).ready(function() {
  PAGE.addModule("SomeModule", SomeModule($("#myBox"), {  someOption : 21  }))
})

```

Example in Module of another constructor
```JavaScript

function AnotherModule() {
  var dog = {
    someModule : SomeModule($("#myBox"), {  someOption : 21  })
  }
  
  // .... other functions that do stuff
  
  function init() {
    // init triggers initializations of things, runs only once
  }
  
  init()
  
  return dog
}
```

Alternatively, you can avoid polluting the namespace entirely and load the module directly at the Page level.

```JavaScript

  		$obj1 = $("#someModuleDiv")

			PAGE.addModule("SomeModule", (function ($obj, options) {

				options = options || { }
				options.someOption = options.someOption || 42

				var dog = {
					options : options
					, $obj : $obj
					, $someThingCool : undefined
				}

				function events() {
					dog.$someThingCool.click(function() {
						console.log("you just clicked me")
					})
					}

				function init() {
					dog.$someThingCool = $obj.find(".somethingCool")
				}

				init()

				return dog
			}($obj1, { someOption : 12 })))


```

So far this looks like a bunch of dog poop. That's because you haven't seen the power of the dog style!
Google Chrome to the rescue.

![google console](http://www.mangoroom.com/work/example-console.png)
