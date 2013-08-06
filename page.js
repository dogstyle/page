var PAGE = (function() {

	var options = { debugMode : true }
		, Page  = function() {}         // base constructor
		, dog   = Page.prototype = {}   // base prototype
		, puppy = new Page()            // base instance

	function log(thing) {
		if (typeof console === "object" && options.debugMode) {
			console.log(thing)
		}
	}

	var add = dog.add = function(path, obj) {
		if (typeof path === "undefined") return
		var arr = path.split(".")
		if (arr.length < 2) return
		var group = arr[0]
			, item = arr[1]
		if (!puppy[group]) puppy[group] = {}
		return puppy[group][item] = obj
	}

	var waitLoad = dog.waitLoad = function(group, name, callback) {
			var limit = 1000
				, count = 0
				, interval

			if (puppy[group] && puppy[group][name]) {
				return callback(puppy[group][name])
			}

			interval = setInterval(function() {
				if (count > limit) {
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

	, wait = dog.wait = function(path, callback) {
		if (typeof path === "undefined") return
		var arr = path.split(".")
		if (arr.length < 2) return
		var group = arr[0]
			, item = arr[1]
		return waitLoad(group, item, callback)
	}

	, addModule = dog.addModule = function(name, obj) {
		return add("Modules", name, obj)
	}

	, addConstructor = dog.addConstructor = function(name, func) {
		return add("Constructors", name, obj)
	}

	, addFunction = dog.addFunction = function(name, func) {
		return add("Functions", name, obj)
	}

	, addProperty = dog.addProperty = function(name, value) {
		return add("Properties", name, obj)
	}

	, extend = dog.extend = function(callback) {
		typeof callback === "function" && callback(puppy, dog, log)
	}

	return puppy

}())
