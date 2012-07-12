var ws;
var url;
var connectionState = {
	notConnected: "not connected",
	connecting: "connecting",
	connected: "connected"
};

var dataArray = [];
for (var i = 0; i < 100; i++) {
	dataArray[i] = 0;
}

var logData = [];
var showTrace = true;
var showDebug = true;
var showInfo = true;
var showWarn = true;
var showError = true;
var showFatal = true;

var state = connectionState.notConnected;

var x = d3.scale.linear()
	.domain([0, 100])
	.range([0, 600])
	
var y = d3.scale.linear()
	.domain([0, 10])
	.range([140, 0])


function connect() {
	url = document.getElementById("server_url").value;
	
	if ("WebSocket" in window) {
		ws = new WebSocket(url);
	} else if ("MozWebSocket" in window) {
		ws = new MozWebSocket(url);
	} else {
		alert('This Browser does not support WebSockets');
		return;
	}

	state = connectionState.connecting;

	ws.onopen = function(e) {
		notice("connection to " + ws.URL + " established!");
		
		document.getElementById("server_url").disabled = true;
		state = connectionState.connected;
	};
	
	ws.onerror = function(e) {
		console.log(e);
		state = connectionState.notConnected;
	};
	
	ws.onclose = function(e) {
		if (state === connectionState.connected) {
			warn("connection to " + ws.URL + " closed!");
		}
		state = connectionState.notConnected;
	};
	
	ws.onmessage = function(msg) {	
		var data = JSON.parse(msg.data);
		
		if (data.type === 'log') {
			logData.push(data.payload);
			updateLog();
		}
		else if(data.type === 'data') {
			dataArray = dataArray.concat(data.payload);
			if (dataArray.length > 100) {
				dataArray.splice(0, dataArray.length - 100);
			}

			update();			
		}
	};
}

function updateLog() {
	var filteredData = logData.filter(function(d) {
		return (showTrace && d.level === 'trace') ||
			(showDebug && d.level === 'debug') ||
			(showInfo && d.level === 'info') ||
			(showWarn && d.level === 'warn') ||
			(showError && d.level === 'error') ||
			(showFatal && d.level === 'fatal');
	})
	
	var logs = d3.select('#log').selectAll('div')
		.data(filteredData);
	
	var logLine = function(d) {
		d.attr('class', function(d) { return d.level; })
		.text(function(d) { return d.message; })
	}
	
	logs.enter().insert('div', ':first-child')
		.call(logLine);
	
	logs.transition()
		.call(logLine);
	
	logs.exit()
		.remove();
}

function notification(CSSClass, msg) {
	d3.select('#notice-area').append('div')
		.attr('class', CSSClass)
		.text(msg)
		.style('opacity', 1)
		.transition()
			.duration(5000)
				.style('opacity', 0)
				.remove();
}

function notice(msg) {
	notification('notice', msg);
}

function warn(msg) {
	notification('warning', msg);
}

function update() {
	var path = plotGroup.selectAll('path')
		.data([dataArray]);

	var drawPath = function(d) {
		d.attr('d', d3.svg.line()
			.x(function(d,i) {return x(i); })
			.y(y)
			.interpolate('linear'))
			
	}
	
	path.enter().append('path')
		.call(drawPath);
	
	path.transition()
		.duration(0)
		.call(drawPath);
	
	// plotGroup
	// 	.attr('transform', 'translate(' + x(2) + ', 0)')
	// 	.transition()
	// 		.duration(500)
	// 			.attr('transform', 'translate(' + x(0) + ', 0)')
	
}

function disconnect() {
	ws.close();
	document.getElementById("server_url").disabled = false;
	document.getElementById("autoConnect").checked = false;
}


function auto_connect() {
	if (document.getElementById("autoConnect").checked === true) {
		if (state === connectionState.notConnected) {
			connect();
		}
	}
}

// function send() {
// 	if (ws === undefined || ws.readyState != 1) {
// 		document.getElementById("messages").innerHTML += "Client: Websocket is not avaliable for writing<br />";
// 		return;
// 	}
// 	
// 	ws.send(document.getElementById("msg").value);
// 	document.getElementById("msg").value = "";
// }
// 

function toggleCube(val, name) {
	if (val) {
		d3.select(name)
			.transition()
				.duration(200)
				.attr('style', 'opacity: 1');
	}
	else {
		d3.select(name)
			.transition()
				.duration(200)
				.attr('style', 'opacity: 0.3');
	}
}

function init() {	
	plotSVG = d3.select('#plot').append('svg')
		.attr('width', 620)
		.attr('height', 155)
	plotGroup = plotSVG.append('g')
	
	$('#toggleTrace').click(function() {
		showTrace = !showTrace;
		toggleCube(showTrace, '#toggleTrace');
		updateLog();
	});
	
	$('#toggleInfo').click(function() {
		showInfo = !showInfo;
		toggleCube(showInfo, '#toggleInfo');
		updateLog();
	});
	
	$('#toggleDebug').click(function() {
		showDebug = !showDebug;
		toggleCube(showDebug, '#toggleDebug');
		updateLog();
	});
	
	$('#toggleWarn').click(function() {
		showWarn = !showWarn;
		toggleCube(showWarn, '#toggleWarn');
		updateLog();
	});
	
	$('#toggleError').click(function() {
		showError = !showError;
		toggleCube(showError, '#toggleError');
		updateLog();
	});
	
	$('#toggleFatal').click(function() {
		showFatal = !showFatal;
		toggleCube(showFatal, '#toggleFatal');
		updateLog();
	});
	
	// connect when ready	
	setInterval(auto_connect, 500);
}


var readyStateCheckInterval = setInterval(function() {
	   if (document.readyState === "complete") {
		   init();
		   clearInterval(readyStateCheckInterval);
	   }
}, 10);

