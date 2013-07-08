var PAGE = (function() {

  var options = { debugMode : true }

	function log(thing) {
		if (typeof console === "object" && options.debugMode) {
			console.log(thing)
		}
	}

	var Dog = function Page() { }

	Dog.prototype.addModule = function(name, obj) {
		if (!this.Modules) this.Modules = {}
		this.Modules[name] = obj
		log("module: " + name + " loaded")
		return obj
	}

	Dog.prototype.addFunction = function(name, func) {
		if (!this.Functions) this.Functions = {}
		this.Functions[name] = func
		log("function: " + name + " loaded")
		return func
	}

	Dog.prototype.addProperty = function(name, value) {
		if (!this.Properties) this.Properties = {}
		this.Properties[name] = value
		log("property: " + name + " loaded")
		return value
	}

	return new Dog()

}())
