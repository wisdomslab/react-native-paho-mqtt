if (typeof module !== 'undefined')
	require('${basedir}/target/src/javascript/mqttws31n.js');
var testServer = "${test.server}";
var testPort = parseInt("${test.server.port}");
var testPath = "${test.server.path}";

describe('client', function() {
	var client = this;
	var connected = false;
	var subscribed = false;
	var messageReceived = false;

	function onConnect() {
		console.log("connected");
		connected = true;
	};

	function onSubscribe() {
		console.log("subscribed");
		subscribed = true;
	};

	function messageArrived(response) {
		console.log("messageArrived");
		messageReceived = true;
		//reponse.invocationContext.onMessageArrived = null;
	};

	it('should create a new client', function() {
		client = new Messaging.Client(testServer, testPort, testPath, "testclientid");
		client.onMessageArrived = messageArrived;

		expect(client).not.toBe(null);
		expect(client.host).toBe(testServer);
		expect(client.port).toBe(testPort);
		expect(client.path).toBe(testPath);
	});

	it('should connect to a server', function() {
		runs(function() {
			client.connect({onSuccess:onConnect});
		});

		waitsFor(function() {
			return connected;
		}, "the client should connect", 10000);

		runs(function() {
			expect(connected).toBe(true);
		});
	});

	it('should subscribe to a topic', function() {
		runs(function() {
			client.subscribe("/World", {onSuccess:onSubscribe});
		});

		waitsFor(function() {
			return subscribed;
		}, "the client should subscribe", 2000);

		runs(function() {
			expect(subscribed).toBe(true);
		});
	});

	it('should send and receive a message', function() {
		runs(function() {
			message = new Messaging.Message("Hello");
			message.destinationName = "/World";
			client.send(message); 
		})

		waitsFor(function() {
			return messageReceived;
		}, "the client should send and receive a message", 2000);

		runs(function() {
			expect(messageReceived).toBe(true);
		})
	});
})