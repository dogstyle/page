PAGE.add("Constructors.Dispatcher", function() {
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
})

PAGE.add("Constructors.DispatcherSpreader", function(numThreads) {

	var dog = {
			numThreads : numThreads
		, dispatchers : []
		, map : { }
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

	function init() {

		PAGE.wait("Constructors.Dispatcher", function(Dispatcher) {

		for(var x = 0; x < numThreads; x++) {
			dog.dispatchers.push(Dispatcher())
		}

		})
	}

	init()

	return dog
})
