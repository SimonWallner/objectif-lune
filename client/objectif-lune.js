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

// ==== Logging Data ====
var logData = [];
var filteredData = [];

var showState = {
	show: 'show',
	hide: 'hide',
	faded: 'faded'
}
var showTrace = showState.show;
var showDebug = showState.show;
var showInfo = showState.show;
var showWarn = showState.show;
var showError = showState.show;
var showFatal = showState.show;

// ==== Scalar Data ====
var scalarData = [];
var scalarID = 0;




function nextShowState(state) {
	if (state === showState.show)
		return showState.faded;
	else if (state == showState.faded)
		return showState.hide;
	else
		return showState.show;
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
		alert('This Browser does not support WebSockets');
		return;
	}

	state = connectionState.connecting;

	ws.onopen = function(e) {
		notice("connection to " + ws.URL + " established!");
		
		document.getElementById("server_url").disabled = true;
		state = connectionState.connected;
		
		d3.select('#log').append('div')
			.attr('class', 'sessionMarker')
			.text('new session started...')
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
			addLog(data.payload);
			d3.select('#lineCounter')
				.text(logData.length);
		}
		else if (data.type === 'scalar') {
			var scalar = data.payload;
			var entry = scalarData[scalar.name];
			
			if (entry) { // scalar is already known
				entry.value = scalar.value;
				d3.select('#scalar-' + entry.id + ' div.value')
					.text(scalar.value)
				
				if (scalar.value < entry.min) {
					entry.min = scalar.value;
					d3.select('#scalar-' + entry.id + ' span.minValue')
						.text(entry.min)
				}
				
				if (scalar.value > entry.max) {
					entry.max = scalar.value
					d3.select('#scalar-' + entry.id + ' span.maxValue')
						.text(entry.max)
				}
			}
			else { // scalar is NEW
				var entry = scalarData[scalar.name] = {
					value: scalar.value,
					min: scalar.value,
					max: scalar.value,
					id: scalarID++,
					highlighted: false
				};
				
				var tile = d3.select('#scalar').append('div')
					.attr('class', 'tile')
					.attr('id', 'scalar-' + entry.id)
				tile.append('div')
					.attr('class', 'name')
					.text(scalar.name);
				tile.append('div')
					.attr('class', 'value')
					.text(scalar.value);
				tile.append('hr');
				
				
				var min = tile.append('div')
					.attr('class', 'minMax')			
				min.append('span')
					.attr('class', 'label')
					.text('min');
				min.append('br');
				min.append('span')
					.attr('class', 'minValue')
					.text(entry.min);
				
				
				var max = tile.append('div')
					.attr('class', 'minMax')
				max.append('span')
					.attr('class', 'label')
					.text('max');
				max.append('br');
				max.append('span')
					.attr('class', 'maxValue')
					.text(entry.min);
					
				// make it clickable
				$('#scalar-' + entry.id).click(function() {
					entry.highlighted = !entry.highlighted;
					
					if (entry.highlighted) {
						d3.select('#scalar-' + entry.id)
							.attr('class', 'tile highlighted')
					}
					else {
						d3.select('#scalar-' + entry.id)
							.attr('class', 'tile')
					}
							
				})
			}
		}
	};
}



function addLog(datum) {
	logData.push(datum);
	d3.select('#lineCounter')
		.text(logData.length);
	
	d3.select('#log').selectAll('div')
		.data(logData)
			.enter().append('div')
				.attr('class', function(d) { return d.level; })
				.text(function(d) { return d.message; })
				.style('opacity', function(d) {
					if (((showTrace === showState.faded) && d.level === 'trace') ||
						((showDebug === showState.faded) && d.level === 'debug') ||
						((showInfo === showState.faded) && d.level === 'info') ||
						((showWarn === showState.faded) && d.level === 'warn') ||
						((showError === showState.faded) && d.level === 'error') ||
						((showFatal === showState.faded) && d.level === 'fatal')) {
						return '0.5';					
					} else
						return '1';
				})
				.style('display', function(d) {
					if (((showTrace === showState.hide) && d.level === 'trace') ||
						((showDebug === showState.hide) && d.level === 'debug') ||
						((showInfo === showState.hide) && d.level === 'info') ||
						((showWarn === showState.hide) && d.level === 'warn') ||
						((showError === showState.hide) && d.level === 'error') ||
						((showFatal === showState.hide) && d.level === 'fatal')) {
						return 'none';					
					} else
						return 'block';
				})
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

function toggleCube(state, name, cls) {
	if (state === showState.show) {
		d3.select(name)
			.transition()
				.duration(200)
				.style('opacity', 1);
				
		d3.selectAll('div.log div.' + cls)
			.style('opacity', 1)
			.style('display', 'block');
	}
	else if (state === showState.faded) {
		d3.select(name)
			.transition()
				.duration(200)
				.style('opacity', 0.5);
		
		d3.selectAll('div.log div.' + cls)
			.style('opacity', 0.5)
			.style('display', 'block');
	}
	
	else if (state === showState.hide) {
		d3.select(name)
			.transition()
				.duration(200)
				.style('opacity', 0.1);
				
		d3.selectAll('div.log div.' + cls)
			.style('opacity', 0.1)
			.style('display', 'none');
	}
}

function init() {	
	plotSVG = d3.select('#plot').append('svg')
		.attr('width', 620)
		.attr('height', 155)
	plotGroup = plotSVG.append('g')
	
	$('#toggleTrace').click(function() {
		showTrace = nextShowState(showTrace);
		toggleCube(showTrace, '#toggleTrace', 'trace');
	});
	
	$('#toggleInfo').click(function() {
		showInfo = nextShowState(showInfo);
		toggleCube(showInfo, '#toggleInfo', 'info');
	});
	
	$('#toggleDebug').click(function() {
		showDebug = nextShowState(showDebug);
		toggleCube(showDebug, '#toggleDebug', 'debug');
	});
	
	$('#toggleWarn').click(function() {
		showWarn = nextShowState(showWarn);
		toggleCube(showWarn, '#toggleWarn', 'warn');
	});
	
	$('#toggleError').click(function() {
		showError = nextShowState(showError);
		toggleCube(showError, '#toggleError', 'error');
	});
	
	$('#toggleFatal').click(function() {
		showFatal = nextShowState(showFatal);
		toggleCube(showFatal, '#toggleFatal', 'fatal');
	});
	
	
	$('#clearLog').click(function() {
		logData = [];
		d3.select('#lineCounter')
			.text('--');
		
		d3.selectAll('div.log div')
			.remove();
	})
	// connect when ready	
	setInterval(auto_connect, 500);
}


var readyStateCheckInterval = setInterval(function() {
	   if (document.readyState === "complete") {
		   init();
		   clearInterval(readyStateCheckInterval);
	   }
}, 10);

