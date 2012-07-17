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

// ==== Time Series Data ====
var timeSeriesData = [];
var plotID = 0;

// ==== session stuff ====
var sessionID = 0;


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
		
		newSessionStarted();
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
				
				var sessionDiv = d3.select('#scalar-session-' + sessionID);
				
				sessionDiv.select('#scalar-' + entry.id + ' div.value')
					.text(round(scalar.value, 2))
				
				if (scalar.value < entry.min) {
					entry.min = scalar.value;
					sessionDiv.select('#scalar-' + entry.id + ' span.minValue')
						.text(round(entry.min, 2))
				}
				
				if (scalar.value > entry.max) {
					entry.max = scalar.value
					sessionDiv.select('#scalar-' + entry.id + ' span.maxValue')
						.text(round(entry.max, 2))
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
				
				var tile = d3.select('#scalar-session-' + sessionID).append('div')
					.attr('class', 'tile')
					.attr('id', 'scalar-' + entry.id)
				tile.append('div')
					.attr('class', 'name')
					.text(scalar.name);
				tile.append('div')
					.attr('class', 'value')
					.text(round(scalar.value, 2));
				tile.append('hr');
				
				
				var min = tile.append('div')
					.attr('class', 'minMax')			
				min.append('span')
					.attr('class', 'label')
					.text('min');
				min.append('br');
				min.append('span')
					.attr('class', 'minValue')
					.text(round(entry.min, 2));
				
				
				var max = tile.append('div')
					.attr('class', 'minMax')
				max.append('span')
					.attr('class', 'label')
					.text('max');
				max.append('br');
				max.append('span')
					.attr('class', 'maxValue')
					.text(round(entry.min, 2));
					
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
		else if (data.type == 'data') {
			var pl = data.payload
			var entry = timeSeriesData[pl.name];
			
			if (entry) // plot already exists
			{
				addData(pl.name, pl.value, pl.reference);
			} else {
				entry = timeSeriesData[pl.name] = {
					name: pl.name,
					data: [],
					id: plotID++,
					min: pl.value,
					max: pl.value,
					bufferLength: 250
				}
				
				var div = d3.select('#data').append('div')
					.attr('id', 'plot-' + entry.id)
					.attr('class', 'plot');
				
				div.append('span')
					.attr('class', 'name')
					.text(pl.name);
				
				// buttons span
				var buttonsSpan = div.append('span')
					.attr('class', 'right')
					
				// buffer length spans
				var bufferLengthSpan = buttonsSpan.append('span')
					.attr('class', 'bufferLength')
					
				bufferLengthSpan.append('span')
					.attr('id', 'plot-' + entry.id + '-10')
					.text('10');
				$('#plot-' + entry.id + '-10').click(function() {
					bufferSetSpanActive(entry.id, '10')
					entry.bufferLength = 10;
				})
				
				bufferLengthSpan.append('span')
					.attr('id', 'plot-' + entry.id + '-50')
					.text('50');
				$('#plot-' + entry.id + '-50').click(function() {
					bufferSetSpanActive(entry.id, '50')
					entry.bufferLength = 50;
				})

				bufferLengthSpan.append('span')
					.attr('id', 'plot-' + entry.id + '-100')
					.text('100');
				$('#plot-' + entry.id + '-100').click(function() {
					bufferSetSpanActive(entry.id, '100')
					entry.bufferLength = 100;
				})
				
				bufferLengthSpan.append('span')
					.attr('id', 'plot-' + entry.id + '-250')
					.text('250')
					.attr('class', 'active');
				$('#plot-' + entry.id + '-250').click(function() {
					bufferSetSpanActive(entry.id, '250')
					entry.bufferLength = 250;
				})
				
				bufferLengthSpan.append('span')
					.attr('id', 'plot-' + entry.id + '-500')
					.text('500');
				$('#plot-' + entry.id + '-500').click(function() {
					bufferSetSpanActive(entry.id, '500')
					entry.bufferLength = 500;
				})
				
				
				
				// update interval spans
				var updateIntervalSpan = buttonsSpan.append('span')
					.attr('class', 'updateInterval');
					
				updateIntervalSpan.append('span')
					.attr('id', 'plot-' + entry.id + '-live')
					.text('live');
				$('#plot-' + entry.id + '-live').click(function() {
					updateSetSpanActive(entry.id, 'live')
					entry.updateCallbackHandle && clearInterval(entry.updateCallbackHandle);
					entry.updateCallbackHandle = setInterval(function() {
						updatePlot(entry.name);
					}, 30);
				})

				updateIntervalSpan.append('span')
					.attr('id', 'plot-' + entry.id + '-1s')
					.text('1s')
				$('#plot-' + entry.id + '-1s').click(function() {
					updateSetSpanActive(entry.id, '1s')
					entry.updateCallbackHandle && clearInterval(entry.updateCallbackHandle);
					entry.updateCallbackHandle = setInterval(function() {
						updatePlot(entry.name);
					}, 1000);
				})
				
				updateIntervalSpan.append('span')
					.attr('id', 'plot-' + entry.id + '-5s')
					.text('5s')
				$('#plot-' + entry.id + '-5s').click(function() {
					updateSetSpanActive(entry.id, '5s')
					entry.updateCallbackHandle && clearInterval(entry.updateCallbackHandle);
					entry.updateCallbackHandle = setInterval(function() {
						updatePlot(entry.name);

					}, 5000);
				})
				
				updateIntervalSpan.append('span')
					.attr('id', 'plot-' + entry.id + '-off')
					.attr('class', 'active')
					.text('off')
				$('#plot-' + entry.id + '-off').click(function() {
					entry.updateCallbackHandle && clearInterval(entry.updateCallbackHandle);
					updateSetSpanActive(entry.id, 'off')
				})
								
				entry.svg = div.append('svg')
					.attr('width', 444)
					.attr('height', 148)
							
				entry.svg.append('g').attr('class', 'axisX');
				entry.svg.append('g').attr('class', 'axisY');
				entry.svg.append('g').attr('class', 'data');
					
				addData(pl.name, pl.value, pl.reference);
			}
		}
	};
}

function updateSetSpanActive(id, button) {
	d3.selectAll('#plot-' + id + ' span.updateInterval span')
		.attr('class', '');
	d3.select('#plot-' + id + '-' + button)
		.attr('class', 'active');
}

function bufferSetSpanActive(id, button) {
	d3.selectAll('#plot-' + id + ' span.bufferLength span')
		.attr('class', '');
	d3.select('#plot-' + id + '-' + button)
		.attr('class', 'active');
}
function addData(name, datum, reference) {
	var entry = timeSeriesData[name];
	
	entry.data.push({x: reference, y: datum});
	
	if (datum < entry.min)
		entry.min = datum;
	if (datum > entry.max)
		entry.max = datum;
		
	if (entry.data.length > entry.bufferLength)
		entry.data.splice(0, entry.data.length - entry.bufferLength);
}

function updatePlot(name) {
	
	var entry = timeSeriesData[name];
	var x = d3.scale.linear()
		.domain([entry.data[0].x, last(entry.data).x])
		.range([0, 444]);
	
	var y = d3.scale.linear()
		.domain([entry.min, entry.max])
		.range([148, 0])
		
	var axisX = d3.svg.axis()
		.scale(x)
		.ticks(5)
		.tickSubdivide(true)
		.tickSize(6, 3, 6)
		.orient('bottom');
	
	var axisY = d3.svg.axis()
		.scale(y)
		.ticks(5)
		.tickSize(6, 3, 6)
		.tickSubdivide(true)
		.orient('left');

	entry.svg.select('g.axisX')
		.attr('transform', 'translate(50, 50)')
		.call(axisX);
	entry.svg.select('g.axisY')
		.attr('transform', 'translate(40, 40)')
		.call(axisY);

	
		
	
	var path = entry.svg.select('g.data').selectAll('path')
		.data([entry.data]);
	
	var drawPath = function(d) {
		d.attr('d', d3.svg.line() 
			.x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); })
			.interpolate('linear'));
	}
	
	path.enter().append('path')
		.call(drawPath)
	
	path.transition()
		.duration(0)
		.call(drawPath)
}

function newSessionStarted() {
	// pre new session
	d3.select('#scalar-session-' + (sessionID))
		.transition().duration(500)
			.style('opacity', 0.5)
			
	// new session
	sessionID++;
	
	// post new session
	d3.select('#log').append('div')
		.attr('class', 'sessionMarker')
		.text('new session started...');
	
	d3.select('#scalar').append('div')
		.attr('class', 'sessionMarker')
		.text('new session started...')
	d3.select('#scalar').append('div')
		.attr('id', 'scalar-session-' + sessionID)
	scalarData = [];
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
	
	$('#clearScalar').click(function() {
		scalarData = [];
		
		d3.selectAll('div.scalar div')
			.remove();
		
		d3.select('#scalar').append('div')
			.attr('id', 'scalar-session-' + sessionID)
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

// ================================= util ================================
function round(value, decimals) {
	decimals = decimals || 0;
	var v = value * Math.pow(10, decimals);
	return Math.round(v) / Math.pow(10, decimals);
}

function last(arr) {
	return arr[arr.length-1];
}