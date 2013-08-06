PAGE.extend(function(instance, proto, log) {

	function Dispatcher() {
		var dog = {
			realcallbacks : {}
			, runners     : []
			, failTimeout : 8000
			, stop        : false
			, timer       : undefined
			, running     : false
			, latest      : undefined
			, random      : function() { return String(Math.random() * 10000).replace(".","") }
			, totalCount  : 0
			, totalComplete  : 0
		}

		function checkIfFinished (id) {
			goNext()
		}

		function goNext() {
			if (dog.runners.length > 0) {
				dog.running = true
				var pup = dog.runners.shift()
				typeof pup.callback === "function" && pup.callback()
			} else {
				dog.running = false
			}
		}

		dog.finish = function(id) {
			var pup = dog.realcallbacks[id]
			pup.ended = true
			if (dog.runners.length > 0) {
				dog.running = true
			}
			delete dog.realcallbacks[id]
			dog.totalComplete++
			goNext()
		}

		dog.makeRunner = function(id, callback) {
			var pup = {
					id           : id
				, callback     : undefined
				, started      : false
				, ended        : false
				, dispatcher   : dog
			}

			dog.totalCount++

			function init() {
				pup.callback = function() {
					console.log(id)
					pup.started = true
					setTimeout(function() {
						checkIfFinished(pup.id)
					}, dog.failTimeout)
					typeof callback === "function" && callback()
				}
				dog.realcallbacks[pup.id] = pup
				dog.runners.push(pup)

				if (!dog.running) {
					goNext()
				}
			}

			init()

			return pup
		}

		return dog
	}

	function DispatcherSpreader(numThreads) {
		var dog = {
			numThreads : numThreads
			, dispatchers : []
			, map : { }
		}

		for(var x = 0; x < numThreads; x++) {
			dog.dispatchers.push(Dispatcher())
		}

		dog.makeRunner = function(id, callback) {
			var dispatcherId = Math.floor(Math.random()*numThreads)
			dog.map[id] = dispatcherId
			dog.dispatchers[dispatcherId].makeRunner(id, callback)
		}

		dog.finish = function(id) {
			var dispatcherId = dog.map[id]
			dog.dispatchers[dispatcherId].finish(id)
		}

		dog.random = function() { return String(Math.random() * 10000).replace(".","") }

		return dog
	}

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

	, addWaitSVG = proto.Image.addWaitSVG = function(url, callback) {

		var dispatcher = proto.Image.ImageDispatcher
			, random = "image" + dispatcher.random()

			if (instance.Images && instance.Images[url]) {
				var $image2 = instance.Images[url]
				var interval2 = setInterval(function() {
					if ($image2.children().length > 0) {
						typeof callback === "function" && callback($image2)
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
					typeof callback === "function" && callback($image)
					clearInterval(interval)
					dispatcher.finish(random)
				}
			}, 200)
		
		})

	}

	, addWaitSVGBatch = proto.Image.addWaitSVGBatch = function(urlArray, callback) {
			var length = 0
				, complete = 0
				, returnedImages = []

			if (typeof urlArray !== "object" || !urlArray.length) { return }

			length = urlArray.length

			for(var x in urlArray) {
				addWaitSVG(urlArray[x], function($image) {
					returnedImages.push($image)
					complete++
					if (complete === length) {
						typeof callback === "function" && callback(returnedImages)
					}
				})
			}
		}

})
