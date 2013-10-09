var PAGE = (function() {

	var Page  = function(){}          // base constructor
		, dog   = Page.prototype = {}   // base prototype
		, puppy = new Page()            // base instance
		, interval = undefined          // timing

		puppy.options = { 
			suppressDebug : false
		}

	var log = dog.log = function(thing) {
		if (typeof console === "object" && !puppy.options.suppressDebug) {
			console.log(thing)
		}
	}

	dog.add = function(path, obj) {
		if (typeof path === "undefined") return
		var arr = path.split(".")
		if (arr.length < 2) return
		var group = arr[0]
			, item = arr[1]
		if (!puppy[group]) puppy[group] = {}
		return puppy[group][item] = obj
	}

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

	dog.waitLoad = function(group, name, callback) {
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

	dog.wait = function(path, callback) {
		if (typeof path === "undefined") return
		var arr = path.split(".")
		if (arr.length < 1) return
		if (arr.length < 2) return dog.waitProto(arr[0], callback)
		return dog.waitLoad(arr[0], arr[1], callback)
	}

	dog.addModule = function(name, obj) {
		return dog.add("Modules." + name, obj)
	}

	dog.addConstructor = function(name, obj) {
		return dog.add("Constructors." + name, obj)
	}

	dog.addFunction = function(name, obj) {
		return dog.add("Functions." + name, obj)
	}

	dog.addProperty = function(name, obj) {
		return dog.add("Properties." + name, obj)
	}

	dog.extend = function(callback) {
		typeof callback === "function" && callback(puppy, dog, log)
	}

	dog.add$ = function(path, obj) {
		$(document).ready(function() {
			dog.add(path, obj)
		})
	}

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

	return puppy

}())
