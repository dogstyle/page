example PAGE
=======

The dog style, or dog "pattern" is a practical way of writing JavaScript (EcmaScript) 
that affords clean modular coding practices that make it easy for others to read and adapt. This style
of writing code takes advantage of Javascript's scoping, and allows you to develop code in tandem with
Chrome's console to rapidly build pages in a testable way.

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
  someModule = PAGE.addModule("SomeModule", ($("#myBox"), {  someOption : 21  }))
})

```

Example in Module
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
