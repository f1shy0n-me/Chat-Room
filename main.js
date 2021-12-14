let ws_uri;
let websocket;

window.onload = function () {
	ws_uri = "ws://chat-room.notahacker10011.repl.co:9600";
	websocket = new WebSocket(ws_uri);

	function MessageAdd(message) {
		let messages = document.getElementById("messages");

		messages.insertAdjacentHTML("beforeend", message);
		messages.scrollTop = messages.scrollHeight;
	}
	function Username() {
		let username = prompt("Enter your username:", "");
		
		if (username.toString().length > 2) {
			localStorage.setItem("username", username);
		}
		else {
			alert("Your username must be at least two characters.");
			Username();
		}
	}

	websocket.onopen = function (event) {
		MessageAdd("<div>You have entered the chat room.</div>");
	}
	websocket.onclose = function (event) {
		MessageAdd("<div>You have been disconnected.</div>");
	}
	websocket.onerror = function (event) {
		MessageAdd("<div>Connection to the chat room has failed.</div>");
	}
	websocket.onmessage = function (event) {
		let data = JSON.parse(event.data);

		if (data.type == "message") {
			MessageAdd("<div class=\"message\">" + data.username + ": " + data.message + "</div>");
		}
	}

	document.getElementById("chat-form").addEventListener("submit", function (event) {
		event.preventDefault();

		let message_element = document.getElementsByTagName("input")[0];
		let message = message_element.value;

		if (message.toString().length) {
			let username = localStorage.getItem("username");
			
			let data = {
				type: "message",
				username: username,
				message: message
			}

			websocket.send(JSON.stringify(data));
			message_element.value = "";
		}
	}, false);

	Username();
}
