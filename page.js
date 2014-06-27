/* PAGE is way of organizing your javascript based app. 
* Works great across pages, or in single page apps, extensions, etc etc.
* Works great with other libraries like jQuery.
* Small by design.
* SEE https://github.com/dogstyle/page
* Created by Justin Kempton
* MIT License
*/
;(function() {

var PAGE = (function() {

	/* 
	* the point of PAGE is to be able to open up a javascript console, type PAGE and see everything you've loaded.
	* For large complex projects this can be very helpful during the debugging process.
	* In addition, with PAGE.test.js, you have integrated code coverage testing
	*
	* For most things, PAGE.add, PAGE.add$, and PAGE.wait are all you need.
	*
	* To add to your PAGE object use PAGE.add("GROUPNAME.THING", THING)
	*
	* Example:
	* PAGE.add("Constructors.MyThing", function(options) {
	* var dog = {}
	* return dog
	* })
	* 
	* to retrieve instance items use PAGE.wait
	* for instance properties PAGE.wait("GROUPNAME.THING", function(THING) {})
	* for prototype PAGE.wait("THING", function(THING) {})
	*
	* To add more functionality to PAGE itself, use PAGE.extend(function(puppy, dog, log)
	* Puppy is the instance, Dog is the Prototype, and Log is for logging.
	*
	* for example, adding a function
	* PAGE.add("Functions.myFunction", function() {
	* alert("dog is great!")
	* })
	*
	* for example, a singleton, what I commonly call 'Modules'
	* PAGE.add("Modules.myModule", (function() {
	* var dog = {}
	* return dog
	* })())
	*
	* for example, a constructor
	* PAGE.add("Constructors.MyConstructor", function() {
	* var dog = {
	*  love : "trucks"
	* }
	* function init() {
	* alert("dogs love " + dog.love)
	* }
	* init()
	* return dog
	* })
	*
	*/

	var Page = function(){}                // base constructor
		, dog = Page.prototype = {}          // base prototype
		, puppy = new Page()                 // base instance
		, speedOfInterval = 150              // speed of interval
		, waitList = dog.waitList = {}       // list of things we are waiting for
		, finishedCallbacks = []             // array of callbacks to run when everything is loaded
		, done = dog.done = function(func) { // method to add to finished callback
			finishedCallbacks.push(func)
		}
		, scriptNumber = 0

	/* internal function calling all done callbacks when everything is finished loading */
	function runFinishedCallbacks() {
		if (checkWaitingList()) return
		for(var x in finishedCallbacks) finishedCallbacks[x](puppy, dog, log)
	}

	/* methods for checking if finished loading */
	function checkWaitingList() {
		var count = 0
		for(var x in waitList) if (!waitList[x]) count++
		return count
	}

	/* logging for everything, gets passed into extend */
	var log = dog.log = function(thing) {
		if (typeof console === "object") {
			console.log(thing)
		}
	}

	// store jQuery for instanceof, in case it gets overriden by some other code
	if (typeof jQuery !== "undefined") {
		dog.jQuery = jQuery
	}

	/* this is the method to add stuff to your app, 
	* example usage: 
	* PAGE.add("Constructors.MyConstructor", function($root, options) { 
	* ... 
	* }) 
	* */
	dog.add = function(path, obj) {
		dog.spawn(path, obj)
		// used to be much bigger, was removed yea!
	}


	/* method for loading external js scripts, used for testing mostly, 
	* production code should be loading as minified unified code, not here, unless there is a good reason */
	var loadScript = dog.loadScript = function(/* pathToFile, allowCache */) {
		var map = mapArguments(arguments)
		, allowCache = map.Boo ? map.Boo[0] : false

		if (!map.Str) return
		if (map.Str.length > 1) {
			for (var x in map.Str) loadScript(map.Str[x], allowCache)
			return
		}

		var pathToFile = map.Str[0]

		var scriptId = pathToFile.replace(/\./g,"_").replace(/\//g, "_").replace(":","")
			, existingElm = document.getElementById(scriptId)
			, increment = allowCache ? String(scriptNumber++) : (String((Math.random() * 1000)).replace(/\./,""))

		if (existingElm) {
			existingElm.parentElement.removeChild(existingElm)
		}

		var fileref = document.createElement('script')
		fileref.setAttribute("type","text/javascript")
		fileref.setAttribute("src", pathToFile.replace(/^~/,"") + "?" + increment) // increment or randomize
		fileref.setAttribute("id", scriptId)
		document.getElementsByTagName("head")[0].appendChild(fileref)

		return puppy
	}

	/* method for loading external libries, that get dumped into the PAGE.Lib object. 
	* loaded scripts must be added to the window object, and the name must be set in the globalVarName
	* Use for testing. Production code should load as bundled minified code */
	dog.AddExternalLib = dog.addExternalLib = function(path, globalVarName, callback) {

		var thing = exists(globalVarName, window)

		if (thing) {
			typeof callback === "function" && callback(thing)
			return puppy
		}

		dog.loadScript(path, false)

		waitExists(globalVarName, window, function(glob) {
			puppy.add("Lib." + globalVarName, glob)
			typeof callback === "function" && callback(glob)
		})

		return puppy
	}

	// allow putting multiple paths into the standard wait function
	dog.wait = function(/* path, path2, path3, callback, refObj */) {
		var map = mapArguments(arguments)
		if (map.Str && map.Obj && !map.Arr) return dog.batchWait.apply(this, arguments)
		else return waitExists.apply(this, arguments)
	}

	/* take a path and check against a the global window variable by default, or set in another variable 
	*
	* for example: waiting for a jquery addon to load
	* PAGE.waitWindow("jQuery.fn.SomeAddon", true, function() {
	*     ... your code here
	* })
	*
	* will add the following as soon as it's finished loading
	* PAGE.Lib.SomeAddon
	*
	* by passing in a object, when it's ready, callback returns it 
	 * add is boolean and optional, add it to the Lib 
	 * callback is function and optional returns the thing */

	dog.waitWindow = function(/* path, add, obj, callback */) {

		var map = mapArguments(arguments)
		, callback = map.Fun ? map.Fun[0] || function(){} : function(){}
		, add = map.Boo ? map.Boo[0] || false : false
		, path = map.Str ? map.Str[0] : undefined
		, obj = map.Obj ? map.Obj[0] : window

		var name = (function() {
			if (!path) {
				return "undefined" + String(Math.random()).replace(".","")
			}

			var arr = path.split(".")
			if (!arr.length) {
				return name
			} else {
				return arr.reverse()[0]
			}
		}())

		waitExists(path, obj, function(thing) {
			if (add) PAGE.spawn("Lib." + name, thing)
			callback(thing)
		})
	}

	/* add a whole bunch of global variables to the PAGE.Lib, return when they are done loading */
	dog.batchWaitWindow = function(/* path, path, arr, path, add, callback */) {
		var waitCount = 1
			, paths = []
			, obj = window

		callback = function(){}

		function finished() {
			waitCount -= 1
			if (!waitCount) callback(PAGE.Lib)
		}

		var map = mapArguments(arguments)
		if (map.Fun) callback = map.Fun[0]
		if (map.Boo) add = map.Boo[0]
		else add = true
		if (map.Obj) obj = map.Obj[0]
		if (map.Arr) {
			for(var x in map.Arr) paths = paths.concat( map.Arr[x] )
		}
		if (map.Str) paths = paths.concat(map.Str)

		waitCount = paths.length

		for(var y in paths) {
			dog.waitWindow(paths[y], add, obj, finished)
		}
	}

	/* this is for extending the PAGE class itself, giving access to the prototype
	* example usage
	* PAGE.extend(function( instance, proto, log ) {
	* proto.Image = {
	*   upload : function() {}
	* }
	* }) */
	dog.extend = function extend(callback) {
		typeof callback === "function" && callback(puppy, dog, log)
	}

	/* special case for adding stuff after jquery has loaded, we all love jquery!
	* example usage :
	* PAGE.add$("Modules.myPage", (function() {
	* ...
	* }()))
	* */
	dog.add$ = function(path, thing) {
		var args = arguments
			, ret = {}

		PAGE.waitExists("jQuery", window, function() {
			$(document).ready(function() {
				ret = dog.add.apply(this, args)
			})
		})

		return thing
	}

	/* immediate check to see if something exists, if so, return it, otherwise return undefined
	* example usage
	* var shoppingCart = PAGE.exists("Properties.ShoppingCart")
	*/
	var exists = dog.exists = function (path, base, alternate) {
		if (typeof path === "undefined" || typeof path === "object") return
		var arr = path.split(".")
			, x = 0
			, obj = base || puppy

		if (arr.length < 1) return alternate

		while (x < arr.length) {
			obj = obj[arr[x]]
			if (obj === undefined || obj === null) return alternate
			x++
		}
		if (typeof obj !== "undefined") 
			return obj
		else
			return alternate
	}

	/* the inverse of exists is spawn */
	dog.spawn = function (path, thing, base) {
		if (typeof path === "undefined" || typeof path === "object") return
		var arr = path.split(".")
			, x = 0
			, obj = base || puppy

		if (arr.length < 1) return

		while (x < arr.length) {

			if (x === arr.length - 1) {
				obj[arr[x]] = thing
				return thing
			} else {
				if (obj[arr[x]] === undefined) {
					obj = obj[arr[x]] = { }
				} else {
					obj = obj[arr[x]]
				}
			}
			x++
		}
	}

	/* remove from page, and from base, and maybe swap it for this, return old */
	dog.remove = function (path, base, swap) {
		if (typeof path === "undefined" || typeof path === "object") return
		var arr = path.split(".")
			, x = 0
			, obj = base || puppy

		if (arr.length < 1) return

		while (x < arr.length) {

			if (x === arr.length - 1) {
				var hold = obj[arr[x]]
				if (swap) {
					obj[arr[x]] = swap
				} else {
					delete obj[arr[x]]
				}
				return hold
			} else {
				if (obj[arr[x]] === undefined) {
					obj = obj[arr[x]] = { }
				} else {
					obj = obj[arr[x]]
				}
			}
			x++
		}
	}

	/* used in testing, to swap out existing libraries for mock libraries
	// call it like this
	//	var swap = PAGE.SwapLib({
	//		"Modules.dataService" : {}
	//		, "Modules.commonMessage" : { someMethod : function(){} }
	//		, "Constructors.YourConstructor" : function(){}
	//		, "Constructors.AnotherConstructor" : function(){}
	//	})
	//
	//	then to return, do swap.restore() */
	dog.SwapLib = function(hash) {

		var pup = {
			restore : undefined // function(){}
			, store : {}
		}

		function init() {

			for (var x in hash) {
				pup.store[x] = dog.remove(x, puppy, hash[x])
			}

		}

		pup.restore = function() {
			for (var x in pup.store) {
				dog.spawn(x, pup.store[x])
				delete pup.store[x]
			}
		}

		init()

		return pup
	}

	/* waitExists --- wait for something to exist then do something 
	* oh my, so simple!, perhaps I will replace the other wait features with this one!
	* this would work for any kind of path
	*/
	
	var waitExists = dog.waitExists = function(path, base, func) {
		var thing
			, limit = 100
			, count = 0
			, interval

		if (typeof base === "function") {
			func = base
			base = undefined
		}

		thing = dog.exists(path, base)

		waitList[path] = false

		if (thing) {
			typeof func === "function" && func(thing)
			waitList[path] = true
			runFinishedCallbacks()
			return thing
		}
		interval = setInterval(function() {
			count++
			if (count > limit) {
				console.error("could not find " + path)
				clearInterval(interval)
				return
			}
			var thing = dog.exists(path,base)
			if (thing) {
				typeof func === "function" && func(thing)
				waitList[path] = true
				clearInterval(interval)
				runFinishedCallbacks()
			}
		}, speedOfInterval)
	}

	/* Load a whole batch of things, pass in array and object, object gets filled by things (by reference), or optionally calls back with the object when it's done. */
	dog.batchWaitRef = function(arr, ref, callback) {
		var count = 0
			, ref = ref || {}
		for (var x = 0; x < arr.length; x++) {
			;(function(index, arr) {
				waitExists(arr[index], function(f) {
					count += 1
					var name = arr[index].split(".").reverse()[0]
					ref[name] = f
					if (count >= arr.length) {
						typeof callback === "function" && callback(ref)
					}
				})
			}(x, arr))
		}
		return puppy
	}

	// this is the lazier, and slower version
	dog.batchWait = function(/* str, str2, str3, obj, callback */) {
		var arr = [] 
			, ref = {}
			, map = mapArguments(arguments)

		if (map.Fun) callback = map.Fun[0]
		if (map.Str) arr = map.Str
		if (map.Obj) ref = map.Obj[0]
		if (map.Arr) arr.concat(map.Str)

		dog.batchWaitRef(arr, ref, callback)
	}

	/* basic method to hide the PAGE object from prying eyes, should be called on done.
	* But it could be called multiple times, and with complex logic, that when minified will make it tough for
	* some kind of hacker to understand what your code is doing. Then again, it's javascript, everything is available
	* so if you really want security, protect the server side code.
	*
	* PAGE.done(function() {
	*   PAGE.stash("secretName")
	* })
	*
	* if you are going to call this in your code, it's important to also save a local reference to the PAGE object, or it will break
	*/
	dog.stash = function(key) {
		if (key) window[key] = puppy
		if (!dog.pointers) dog.pointers = {}
		else {
			for(var x in dog.pointers) delete window[x]
		}
		dog.pointers[key] = true
		delete window.PAGE
		return puppy
	}

	var getType = dog.getType = function(thing){
		var shorten = "StringBooleanArrayObjectNumberFunction"
			, ret
    if(thing===null) return "Null"
		if(typeof thing === "object" && thing instanceof dog.jQuery) return "jQuery"
    ret = Object.prototype.toString.call(thing).slice(8, -1)
		if (shorten.indexOf(ret) > -1)
			return ret.substr(0,3)
		else
			return ret
	}

	function pushInObj(name, item, obj) {
		if (!obj[name]) obj[name] = []
		obj[name].push(item)
	}

	var mapArguments = dog.mapArguments = function(args) {
		var map = {}

		for(var y = 0; y < args.length; y++)
			pushInObj(getType(args[y]), args[y], map)

		return map
	}

	dog.version = "2.0.2"

	// now we return the whole puppy!
	return puppy

}())

// We are going with PAGE here, as the name
window.PAGE = PAGE

}())


