// Include required modules.
var http = require('http');
var qs = require('querystring');
var RestClient = require('twilio').RestClient;
var geo = require('geo');
var GooglePlaces = require('./modules/google-places');

// Include and instantiate config.
var config = require('./config/config')();

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
		
		var message = qs.parse(payload);
		var address = config.getAddress(message.Body);
		var type = config.getType(message.Body).toLowerCase();
		var senderNumber = message.From;

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
				
				// Send response SMS message & log result.
				var sms = new RestClient(config.twilio_sid, config.twilio_token);
				sms.sendSms(config.twilio_outgoing, senderNumber, answer, function sendSMS() {
					res.writeHead(200);
	        		res.end();
				});

			});

		});

        res.writeHead(200);
        res.end();

	});

}).listen(config.listen_port);

console.log('Listening on port ' + config.listen_port);