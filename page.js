/* PAGE is way of organizing your javascript based app. 
* Works great across pages, or in single page apps, extensions, etc etc.
* Works great with other libraries like jQuery.
* Can be extended to work great with other libraries
* Small by design.
* SEE https://github.com/dogstyle/page
* MIT License
*/
var PAGE = (function() {

	/* 
	* the poing of PAGE is to be able to open up a javascript console, type PAGE
	* and see everything you've loaded into your page.
	*
	* try it, it's cool.
	*
	* because PAGE is a singleton, it doesn't really matter if methods are added to the prototype or the instance.
	* However, in the console, there is a nice seperation between the instance methods and the prototype methods.
	* So, for this reason alone I have seperated them.
	*
	* to add more functionality to PAGE itself, use PAGE.extend(function(puppy, dog, log)
	* to add more instance properties use PAGE.add("GROUPNAME.THING", THING)
	* 
	* to retrieve either use PAGE.wait
	* for instance properties PAGE.wait("GROUPNAME.THING", function(THING) {})
	* for prototype PAGE.wait("THING", function(THING) {})
	*
	* For most things, PAGE.add, PAGE.add$, and PAGE.wait or all you need.
	*
	* for example, adding a function
	* PAGE.add("Functions.myFunction", function() {
	* alert("dog is great!")
	* })
	*
	* for example, a singleton
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
		, interval = undefined          // timing

	/* logging for everything, gets passed into extend */
	function log(thing) {
		if (typeof console === "object") {
			console.log(thing)
		}
	}

	/* this is how you add stuff to your app, 
	* example usage: 
	* PAGE.add("Constructors.MyConstructor", function($root, options) { 
	* ... 
	* }) 
	* */
	dog.add = function(path, obj, test) {
		if (typeof path === "undefined") return
		var arr = path.split(".")
		if (arr.length < 2) return
		var group = arr[0]
			, item = arr[1]
		if (!puppy[group]) puppy[group] = {}
		return puppy[group][item] = obj
	}

	/* this is how to wait for methods that have been added using extend
	* use PAGE.wait() instead
	* might be useful while extending the functionality PAGE itself
	* example usage: 
	* PAGE.waitProto("Image", function(Image) {
	* var image = Image
	* }) 
	* */
	dog.waitProto = function(name, callback) {
		var limit = 1000
			, count = 0
			, interval

		if (dog[name]) {
			return callback(dog[name])
		}

		interval = setInterval(function() {
			if (count > limit) {
				console.error("could not find prototype " + name)
				clearInterval(interval)
				return
			}
			if (count > limit || (dog[name])) {
				if (typeof callback === "function") {
					callback(dog[name])
				}
				clearInterval(interval)
			}
			count++
		}, 10)
	}

	/* the base of PAGE.wait(...)
	* example usage :
	* PAGE.waitLoad("Constructors", "Popup", function(Popup) {
	* ...
	* }) */
	dog.waitLoad = function(group, name, callback) {
			var limit = 1000
				, count = 0
				, interval

			if (puppy[group] && puppy[group][name]) {
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
						callback(puppy[group][name])
					}
					clearInterval(interval)
				}
				count++
			}, 10)
		}

	/* the shorthand of PAGE.wait(...)
	* example usage :
	* PAGE.wait("Constructors.Popup", function(Popup) {
	* ...
	* }) */
	dog.wait = function(path, callback) {
		if (typeof path === "undefined") return
		var arr = path.split(".")
		if (arr.length < 1) return
		if (arr.length < 2) return dog.waitProto(arr[0], callback)
		return dog.waitLoad(arr[0], arr[1], callback)
	}

	/* this is for extending the PAGE class itself, giving access to the prototype
	* example usage
	* PAGE.extend(function( instance, proto, log ) {
	* proto.Image = {
	*   upload : function() {}
	* }
	* }) */
	dog.extend = function(callback) {
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
		try {
			$(document).ready(function() {
				dog.add.apply(puppy, args)
			})
		} 
		catch (ex) {
			throw(ex)
		}
	}

	/* immediate check to see if something exists, if so, return it, otherwise return undefined
	* example usage
	* var shoppingCart = PAGE.exists("Properties.ShoppingCart")
	*/
	dog.exists = function (path) {
		if (typeof path === "undefined") return
		var arr = path.split(".")
			, x = 0
			, obj = puppy

		if (arr.length < 1) return

		while (x < arr.length) {
			obj = obj[arr[x]]
			if (obj === undefined) return obj
			x++
		}
		return obj
	}

	/* returns an empty object, when it's finished loading asynchronously, the returned object gets changed to the finished object
	* This is dangerous practice, so be careful. Don't expect the object returned to behave the way intended. check for wait if you don't know for sure
	* example usage
	* var popupCode = PAGE.get("Constructors.Popup")
	*   , someFunction = PAGE.get("Functions.someFunction")
	*
	* // checking to see it's loaded, if it wait as a property, then it's not done (unless of course the thing you are trying to return also has a wait property.... presents a curious puzzle, bah)
	* if (!someFunction.wait) someFunction()
	*
	*/
	dog.get = function(path) {
		var _this = { wait : true }
		dog.wait(path, function(f) {
			_this = f
		})
		return _this
	}

	return puppy

}())
