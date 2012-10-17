// Include required modules.
var http = require('http');
var smsified = require('smsified');
var geo = require('geo');
var cradle = require('cradle');
var GooglePlaces = require('./modules/google-places');

// Include and instantiate config.
require('./config/config');
var config = new Config();

// Create HTTP server to process inbound requests from SMSified
var server = http.createServer(function inboundSMSServer(req, res) {


	// Variable to hold JSON payload.
	var payload = '';

	// Get JSON payload from SMSified.
	req.addListener('data', function getPayload(data) {
		payload += data;
	});

	// Process inbound message.
	req.addListener('end', function processPayload() {

		var json = JSON.parse(payload);
		var inbound = new InboundMessage(json);
		var address = config.getAddress(inbound.message);
		var type = config.getType(inbound.message).toLowerCase();
		var senderNumber = inbound.senderAddress;	

		// Geocode address from the SMS message.
		geo.geocoder(geo.google, address, false, function geocodeAddress(formattedAddress, latitude, longitude) {

		    // Look up places for address.
		    var places = new GooglePlaces(config.google_api_key);
			places.search({location: [latitude,longitude], types: [type], rankby: 'distance', sensor: false}, function(err, response) { 
				if(err) {
					var answer = "Could not look up locations for that address.";
				}
				else if (response.results.length == 0) {
					var answer = "No  " + type + " results found for that address.";
				}
				else {
					var answer = config.formatResponse(type, response.results[0]);
				}

				// Create log record.
				var logRecord = {
					user: senderNumber,
					address: address,
					lat: latitude,
					lon: longitude,
					type: type,
					message: answer
				};
	
				// Set up connection to CouchDB instance for logging.
				var logdb = new (cradle.Connection)(config.couchdb_host, config.couchdb_port, {
					auth : {
						username : config.couchdb_user,
						password : config.couchdb_password
					}
				}).database(config.couchdb_name);
				
				// Send response SMS message.
				var sms = new SMSified(config.smsified_user, config.smsified_password);
				var options = {senderAddress: config.smsified_sender_address, address: senderNumber, message: answer};

				// Send response to user & log result.
				sms.sendMessage(options, function sendSMSMessage(result) {
					logRecord.result = result;
					logdb.save(logRecord, function saveLogRecord(err, res){
						if(err) {
							console.log('An error occured when saving message 	log: ' + err.error + ' ' + err.reason);
						}
					});
				});
				

			});

		});

        res.writeHead(200);
        res.end();

	});

}).listen(config.listen_port);

console.log('Listening on port ' + config.listen_port);