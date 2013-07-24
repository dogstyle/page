var PAGE = (function() {

	var options = { debugMode : true }

	function log(thing) {
		if (typeof console === "object" && options.debugMode) {
			console.log(thing)
		}
	}

	function Page() { }

	Page.prototype = {
		waitLoad : function(group, name, callback) {
				var limit = 100
					, count = 0
					, interval

				if (PAGE[group] && PAGE[group][name]) {
					return callback(PAGE[group][name])
				}

				interval = setInterval(function() {
					if (count > limit) {
						typeof console === "object" && console.error("could not find module: " + group + ":" + name)
						clearInterval(interval)
						return
					}
					if (count > limit || (PAGE[group] && PAGE[group][name])) {
						if (typeof callback === "function") {
							callback(PAGE[group][name])
						}
						clearInterval(interval)
					}
					count++
				}, 10)
			}
		, wait : function(path, callback) {
			if (typeof path === "undefined") return

			var arr = path.split(".")

			if (arr.length < 2) return

			var group = arr[0]
				, item = arr[1]

			return this.waitLoad(group, item, callback)
		}
		, addModule : function(name, obj) {
			if (!this.Modules) this.Modules = {}
			this.Modules[name] = obj
			log("module: " + name + " loaded")
			return obj
		}
		, addQuestion : function(name, obj) {
			if (!this.Questions) this.Questions = {}
			this.Questions[name] = obj
			log("question: " + name + " loaded")
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
		, addImages : function(obj) {
			this.Images = obj
			log("added all images")
			return obj
		}
		, addImage : function(name, obj) {
			if (!this.Images) this.Images = {}
			this.Images[name] = obj
			log("image: " + name + " loaded")
			return this.Images[name]
		}
		, addSVG : function(name, url) {
			this.addImage(name, (function() {
				var $svg = $('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" xml:space="preserve"></svg>')

				$.ajax({
					url : url
					, dataType : "xml"
					, success : function(data, b, c) {
						var $newSVG = $(data).find("svg")
							, allAttributes = $newSVG[0].attributes

						$.each(allAttributes, function(index, item) {
							var key = item.name
								, value = item.value

								if (key !== "id") {
									$svg.get(0).setAttribute(key, value)
								}
						})

						$svg.attr("preserveAspectRatio", "xMidYMid meet")

						$newSVG.children().each(function() {
							$(this).appendTo($svg)
						})

					}

				})

				return $svg
			}()))
		}
		, addWaitSVG : function(url, callback) {
			if (this.Images && this.Images[url]) {
				var $image2 = this.Images[url]
				var interval2 = setInterval(function() {
					if ($image2.children().length > 0) {
						typeof callback === "function" && callback($image2)
						clearInterval(interval2)
					}
				}, 200)
				return
			}
			this.addSVG(url, url)
			var $image = this.Images[url]
			var interval = setInterval(function() {
				if ($image.children().length > 0) {
					typeof callback === "function" && callback($image)
					clearInterval(interval)
				}
			}, 200)
		}
	}

	return new Page()

}())
