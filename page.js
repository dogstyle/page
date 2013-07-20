var PAGE = (function() {

  var options = { debugMode : true }

	function log(thing) {
		if (typeof console === "object" && options.debugMode) {
			console.log(thing)
		}
	}

	var Dog = function Page() { }
		, interval = undefined

	Dog.prototype = {
		waitLoad : function(group, name, callback) {
			var limit = 100
				, count = 0

			if (PAGE[group] && PAGE[group][name]) {
				return callback(PAGE[group][name])
			}

			interval = setInterval(function() {
				if (count > limit || (PAGE[group] && PAGE[group][name])) {
					if (typeof callback === "function") {
						callback(PAGE[group][name])
					}
					clearInterval(interval)
				}
				count++
			}, 10)
		}
		, addConstructor : function(name, constructor) {
			if (!this.Constructors) this.Constructors = {}
			this.Constructors[name] = constructor
			log("Constructors: " + name + " loaded")
			return constructor
		}
		, addModule : function(name, obj) {
			if (!this.Modules) this.Modules = {}
			this.Modules[name] = obj
			log("module: " + name + " loaded")
			return obj
		}
		, addFunction : function(name, func) {
			if (!this.Functions) this.Functions = {}
			this.Functions[name] = func
			log("function: " + name + " loaded")
			return func
		}
		, addProperty : function(name, value) {
			if (!this.Properties) this.Properties = {}
			this.Properties[name] = value
			log("property: " + name + " loaded")
			return value
		}
	}

	return new Dog()

}())
