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
	* In addition, with PAGE.test.js, you have an easy integrated code coverage testing
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
	var Page  = function(){}          // base constructor
		, dog   = Page.prototype = {}   // base prototype
		, puppy = new Page()            // base instance
		, speedOfInterval = 150         // speed of interval
		, waitList = dog.waitList = {}  // list of things added
		, finishedCallbacks = []        // array of callbacks to run when everything is loaded
		, done = dog.done = function(func) { // method to add to finished callback
			finishedCallbacks.push(func)
		}

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

	/* this is the method to add stuff to your app, 
	* example usage: 
	* PAGE.add("Constructors.MyConstructor", function($root, options) { 
	* ... 
	* }) 
	* */
	dog.add = function(path, obj) {
		if (typeof path === "undefined") return
		var arr = path.split(".")
		if (arr.length < 2) return
		var group = arr[0]
			, item = arr[1]
		if (!puppy[group]) puppy[group] = {}
		return puppy[group][item] = obj
	}

	/* this is a base method for returning prototype
	* use PAGE.wait() instead
	* might be useful while extending the functionality PAGE itself
	* example usage: 
	* PAGE.waitProto("Image", function(Image) {
	* var image = Image
	* }) 
	* */
	dog.waitProto = function(name, callback) {
		var limit = 100
			, count = 0
			, interval

		waitList[name] = false

		// check the prototype for the thing
		if (dog[name]) {
			waitList[name] = true
			return callback(dog[name])
		}

		// ah hell, check the instance also, means you can't have it in both places, not sure if this is a good thing or not
		if (puppy[name]) {
			waitList[name] = true
			return callback(puppy[name])
		}

		interval = setInterval(function() {
			if (count > limit) {
				console.error("could not find prototype " + name)
				clearInterval(interval)
				return
			}
			if (dog[name]) {
				if (typeof callback === "function") {
					callback(dog[name])
				}
				waitList[name] = true
				clearInterval(interval)
				runFinishedCallbacks()
			}
			count++
		}, speedOfInterval)
	}

	/* the base of PAGE.wait(...)
	* example usage :
	* PAGE.waitLoad("Constructors", "Popup", function(Popup) {
	* ...
	* }) */
	dog.waitLoad = function(group, name, callback, refObj) {
		var limit = 100 // number of tries (multiply by interval to get time in miliseconds
			, count = 0
			, interval

		refObj = refObj || {}

		waitList[group + "." + name] = false

		if (puppy[group] && puppy[group][name]) {
			waitList[group + "." + name] = true
			return callback(puppy[group][name])
		}

		interval = setInterval(function() {
			if (count > limit) {
				debugger
				console.error("could not find " + group + ":" + name)
				clearInterval(interval)
				return
			}
			if (count > limit || (puppy[group] && puppy[group][name])) {
				if (typeof callback === "function") {
					refObj[name] = puppy[group][name]
					callback(puppy[group][name])
				}
				waitList[group + "." + name] = true
				clearInterval(interval)
				runFinishedCallbacks()
			}
			count++
		}, speedOfInterval)
	}

	/* method for loading external js scripts, used for testing, 
	* production code should be loading as minified unified code */
	dog.loadScript = function(pathToFile) {
		var scriptId = pathToFile.replace(/\./g,"_")
			, existingElm = document.getElementById(scriptId)

		if (existingElm) {
			existingElm.parentElement.removeChild(existingElm)
		}

		var fileref = document.createElement('script')
		fileref.setAttribute("type","text/javascript")
		fileref.setAttribute("src", pathToFile + "?" + (String(Math.random()).replace(/\./,""))) // randomize
		fileref.setAttribute("id", scriptId)
		document.getElementsByTagName("head")[0].appendChild(fileref)
	}

	/* method for loading external libries, that get dumped into the PAGE.Lib object. 
	* loaded scripts must be added to the window object, and the name must be set in the globalVarName
	* Use for testing. Production code should load as bundled minified code */
	dog.AddExternalLib = function(path, globalVarName, callback) {

		if (dog.exists("Lib." + globalVarName)) {
			typeof callback === "function" && callback(window[globalVarName])
			return
		}

		dog.loadScript(path)
		var interval = setInterval(function() {
			var glob = window[globalVarName]
			if (glob) {
				clearInterval(interval)
				if (!puppy.Lib) puppy.Lib = {}
				puppy.add("Lib." + globalVarName, glob)
				typeof callback === "function" && callback(glob)
			}
		}, 100)
	}

	/* the shorthand of PAGE.waitLoad(...)
	* example usage :
	* PAGE.wait("Constructors.Popup", function(Popup) {
	* ...
	* }) 
	* alternatively
	* This adds it to the refObj
	* PAGE.wait("Constructors.Popup", callback, refObj)
	*
	* */
	var _wait = function(path, callback, refObj) {
		refObj = refObj || {}
		if (typeof path === "undefined") return
		var arr = path.split(".")
		if (arr.length < 1) return
		if (arr.length < 2) return dog.waitProto(arr[0], callback)
		return dog.waitLoad(arr[0], arr[1], callback, refObj)
	}

	// allow putting multiple paths into the standard wait function
	dog.wait = function(path, path2, path3, callback, refObj) {
		var map = mapArguments(arguments)
		if (map.Str && map.Str.length > 1) return dog.batchWait.apply(this, arguments)
		else return _wait.apply(this, arguments)
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
	dog.waitWindow = function(path, add, obj, callback) {

		var map = mapArguments(arguments)
		if (map.Fun) callback = map.Fun[0]
		if (map.Boo) add = map.Boo[0]
		if (map.Str) path = map.Str[0]
		if (map.Obj) obj = map.Obj[0]
		else obj = window

		// var name = path.split(".").reverse()[0]
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

		var glob = dog.exists(path, obj)

		if (glob) {
			callback(glob)
			if (add) {
				if (!puppy.Lib) puppy.Lib = {}
				puppy.add("Lib." + name, glob)
			}
			return glob
		}

		var interval = setInterval(function() {
			glob = dog.exists(path, obj)
			if (glob) {
				clearInterval(interval)
				if (add) {
					if (!puppy.Lib) puppy.Lib = {}
					puppy.add("Lib." + name, glob)
				}
				callback(glob)
			}
		}, 100)
	}

	/* add a whole bunch of global variables to the PAGE.Lib, return when they are done loading */
	dog.batchWaitWindow = function(path, path, arr, path, add, callback) {
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
	dog.add$ = function() {
		var args = arguments
			, ret = {}
		try {
			$(document).ready(function() {
				ret = dog.add.apply(puppy, args)
			})
		} 
		catch (ex) {
			throw(ex)
		}
		return ret
	}

	/* immediate check to see if something exists, if so, return it, otherwise return undefined
	* example usage
	* var shoppingCart = PAGE.exists("Properties.ShoppingCart")
	*/
	dog.exists = function (path, base) {
		if (typeof path === "undefined" || typeof path === "object") return
		var arr = path.split(".")
			, x = 0
			, obj = base || puppy

		if (arr.length < 1) return

		while (x < arr.length) {
			obj = obj[arr[x]]
			if (obj === undefined) return obj
			x++
		}
		return obj
	}

	/* Load a whole batch of things, pass in array and object, object gets filled by things (by reference), or optionally calls back with the object when it's done. */
	dog.batchWaitRef = function(arr, ref, callback) {
		var count = 0
			, ref = ref || {}
		for (var x = 0; x < arr.length; x++) {
			;(function(index, arr) {
				_wait(arr[index], function(f) {
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

	dog.batchWait = function(str, str2, str3, obj, callback) {
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

	/* use to map arguments, also used by my methods */
	dog.Helpers = {
		mapArguments : function(args) { return {} }
	}

	var mapArguments = dog.Helpers.mapArguments = function(args) {
		var map = {}
		// , type

		function pushIn(name, item) {
			if (!map[name]) map[name] = []
			map[name].push(item)
		}

		for(var y = 0; y < args.length; y++) {

			var type = typeof args[y]

			if (type === "undefined") {
				pushIn("Und", args[y])
				continue
			}

			if (type === "function") {
				pushIn("Fun", args[y])
				continue
			}

			if (type === "string") {
				pushIn("Str", args[y])
				continue
			}

			if (type === "boolean") {
				pushIn("Boo", args[y])
				continue
			}

			if (type === "number") {
				pushIn("Num", args[y])
				continue
			}

			if (type === "object") {
				if (args[y] === null) {
					pushIn("Nul", args[y])
					continue
				}
				if (args[y].constructor === Array) {
					pushIn("Arr", args[y])
					continue
				}
				if  (args[y] instanceof Error) { 
					pushIn("Error", args[y])
					continue
				}
				pushIn("Obj", args[y])
			}
		}

		return map
	}

	return puppy

}())

window.PAGE = PAGE

}())


