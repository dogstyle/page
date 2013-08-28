PAGE.extend(function(instance, proto, log) {

	PAGE.wait("Constructors.Dispatcher", function(Dispatcher) {
	PAGE.wait("Constructors.DispatcherSpreader", function(DispatcherSpreader) {

		proto.Image = { }
		proto.Image.ImageDispatcher = DispatcherSpreader(12)

		var addImage = proto.Image.addImage = function(name, obj) {
			if (!instance.Images) instance.Images = {}
			instance.Images[name] = obj
			log("image: " + name + " loaded")
			return instance.Images[name]
		}

		, addSVG = proto.Image.addSVG = function(name, url) {

			proto.Image.addImage(name, (function() {
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

		, addWaitSVG = proto.Image.addWaitSVG = function(url, callback, index) {

			var dispatcher = proto.Image.ImageDispatcher
				, random = "image" + dispatcher.random()

				if (instance.Images && instance.Images[url]) {
					var $image2 = instance.Images[url]
					var interval2 = setInterval(function() {
						if ($image2.children().length > 0) {
							typeof callback === "function" && callback($image2, index)
							clearInterval(interval2)
						}
					}, 200)
					return
				}

			dispatcher.makeRunner(random, function() {

				proto.Image.addSVG(url, url)
				var $image = instance.Images[url]
				var interval = setInterval(function() {
					if ($image.children().length > 0) {
						typeof callback === "function" && callback($image, index)
						clearInterval(interval)
						dispatcher.finish(random)
					}
				}, 200)
			
			})

		}

		, addWaitSVGBatch = proto.Image.addWaitSVGBatch = function(urlArray, eachCallback, batchCallback) {
				var length = 0
					, complete = 0
					, returnedImages = new Array(urlArray.length)

				if (typeof urlArray !== "object" || !urlArray.length) { return }

				length = urlArray.length

				for(var x = 0; x < length; x++) {
					addWaitSVG(urlArray[x], function($image, index) {
						returnedImages.splice(index, 1, $image)
						typeof eachCallback === "function" && eachCallback($image)
						complete++
						if (complete === length) {
							typeof batchCallback === "function" && batchCallback(returnedImages)
						}
					}, x)
				}
			}

	})
	})

})
