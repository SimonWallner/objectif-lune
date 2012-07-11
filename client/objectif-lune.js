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
		document.getElementById("messages").innerHTML += "This Browser does not support WebSockets<br />";
		return;
	}

	state = connectionState.connecting;

	ws.onopen = function(e) {
		document.getElementById("messages").innerHTML += "Client: A connection to " + ws.URL + " has been opened.<br />";
		
		document.getElementById("server_url").disabled = true;
		state = connectionState.connected;
	};
	
	ws.onerror = function(e) {
		document.getElementById("messages").innerHTML += "Client: An error occured, see console log for more details.<br />";
		console.log(e);
		state = connectionState.notConnected;
	};
	
	ws.onclose = function(e) {
		if (state === connectionState.connected) {
			document.getElementById("messages").innerHTML += "Client: The connection to " + url + " was closed.<br />";			
		}
		state = connectionState.notConnected;
	};
	
	ws.onmessage = function(msg) {
		var payload = msg.data;
		
		var data = JSON.parse(payload);
		dataArray = dataArray.concat(data.payload);
		if (dataArray.length > 100) {
			dataArray.splice(0, dataArray.length - 100);
		}
		
		update();
	};
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
	state = connectionState.notConnected;
}


function auto_connect() {
	if (document.getElementById("autoConnect").checked === true) {
		if (state === connectionState.notConnected) {
			connect();
		}
	}
}

function poll_server() {
	if (ws && ws.readyState === 1) {
		ws.send("poll");
	}
}

function send() {
	if (ws === undefined || ws.readyState != 1) {
		document.getElementById("messages").innerHTML += "Client: Websocket is not avaliable for writing<br />";
		return;
	}
	
	ws.send(document.getElementById("msg").value);
	document.getElementById("msg").value = "";
}

// connect when ready

function init() {
	
	plotSVG = d3.select('#plot').append('svg')
		.attr('width', 620)
		.attr('height', 155)
	plotGroup = plotSVG.append('g')
	
	setInterval(auto_connect, 500);
	setInterval(poll_server, 500);
}


var readyStateCheckInterval = setInterval(function() {
	   if (document.readyState === "complete") {
		   init();
		   clearInterval(readyStateCheckInterval);
	   }
}, 10);

