var ws;
var url;
var connectionState = {
	notConnected: "not connected",
	connecting: "connecting",
	connected: "connected"
}

var state = connectionState.notConnected;

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
    
    ws.onmessage = function(e) {
        document.getElementById("messages").innerHTML += "Server: " + e.data + "<br />";
    };
}

function disconnect() {
    ws.close();
    document.getElementById("server_url").disabled = false;
	document.getElementById("autoConnect").checked = false;
	state = connectionState.notConnected;
}

// function toggle_connect() {
//     if (document.getElementById("server_url").disabled === false) {
//         connect();
//     } else {
//         disconnect();
//     }
// }

function auto_connect() {
	if (document.getElementById("autoConnect").checked === true) {
		if (state === connectionState.notConnected) {
			connect();
		}
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

setInterval(auto_connect, 500);

// var readyStateCheckInterval = setInterval(function() {
//     if (document.readyState === "complete") {
//         toggle_connect();
//         clearInterval(readyStateCheckInterval);
//     }
// }, 10);

