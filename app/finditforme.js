/*
 * FindItForMe - an SMS application that finds service locations and
 *  places of interest in cities.
 *
 * Copyright:	2011 Mark J. Headd (http://www.voiceingov.org)
 * Author:		Mark Headd
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

// Include required base modules.
var sys = require('sys');
var http = require('http');

// Include required custom modules.
var smsified = require('smsified');
var cradle = require('cradle');
var geo = require('geo');

// Include config files.
var locationTypes = require('./locationTypes');
var config = require('./config');

//Last ditch hander for an exception.
process.on('uncaughtException', function (err) {
	  sys.puts('An unhandled exception occured: ' + sys.inspect(err));
});

// Function to extract loaction type from an inbound SMS message.
function getRequestType(message) {
	if(message.search('#') == -1) {
		throw new RequestFormatException("No # in message body.");
	}
	return config.couchdb.geoprefix + message.substring((message.indexOf('#')+1), message.length);
}

// Function to extract an address from an inbound SMS message.
function getAddress(message) {
	if(message.search('#') == -1) {
		throw new RequestFormatException("No # in message body.");
	}
	return message.substring(0, message.indexOf('#'));	
}

// Make a bounding box from a lat / lon set. 
function makeBoundingBox(lon, lat) {
	factor = config.general.distanceFactor;
	return new Array(lon-factor,lat-factor,lon+factor,lat+factor);
}

// Function to calculate distance between two points.
function calculateDistant(lat1, lon1, lat2, lon2) {
	distance = 3958 * 3.1415926 * Math.sqrt((lat2 - lat1) * (lat2 - lat1)
			+ Math.cos(lat2 / 57.29578) * Math.cos(lat1 / 57.29578)
			* (lon2 - lon1) * (lon2 - lon1)) / 180;
	return Math.round(distance * 100) / 100;
}

// Sort function for distance array.
function sortOnDistance(a,b) {
	return a.distance - b.distance;
}

// Simple object to wrap exceptions.
function RequestFormatException(message) {
	this.message = message;
	this.name = "RequestFormatException";
}

// Functon to send SMS messages through SMSified.
function sendMessage(message, senderNumber) {	
	
	// Create new SMSified object and options.
	var sms = new SMSified(config.smsified.username, config.smsified.password);
	var smsOptions = { senderAddress: config.smsified.senderAddress, address: senderNumber , message: message};
	
	// Create new Cradle object for storing SMS delivery records.
	var logdb = new (cradle.Connection)(config.couchdb.loghost, config.couchdb.logport, {
		auth : {
			username : config.couchdb.loguser,
			password : config.couchdb.logpass
		}
	}).database(config.couchdb.logname);
	
	// Send message and store resonse from SMSified in log instance of CouchDB.
	sms.sendMessage(smsOptions, function(data) {
		logdb.save(data, function(err, res){
            if(err) {
                    sys.puts('ERROR: Could not save delivery record. ' + data);
            }
            else {
                    sys.puts('delivery record saved '+ res.id);
            }
		});                            			
	});	
	
}

// Create an HTTP server for inbound requests.
var server = http.createServer(function(req, res) {

        req.addListener('data', function(data){        	
        	
        	try {    
        		
        		// Process the inbound SMS message.
        		var request = JSON.parse(data);
        		var message = request.inboundSMSMessageNotification.inboundSMSMessage.message; 
        		var senderNumber = request.inboundSMSMessageNotification.inboundSMSMessage.senderAddress;
        		var requestType = getRequestType(message);
        		var address = getAddress(message);
            	
            	// Create new Cradle object for querying the locations database.
            	var geodb = new (cradle.Connection)(config.couchdb.geohost, config.couchdb.geoport).database(requestType);
            	
            	// Geocode the address submitted with the SMS message.
            	geo.geocoder(geo.google, address, false, function(formattedAddress, latitude, longitude) {
            		
                    if(latitude && longitude) {
                    	
                    	// Look up locations based on bounding box.
                    	bbox = makeBoundingBox(longitude, latitude);
                        geodb.query('GET', config.couchdb.geopath, {bbox: bbox.join(',')}, function(err, res) {
                        	if(err) {
                        		sys.puts('CouchDB error, reason: ' + err.reason);
                        		sendMessage('Sorry, an error occured. Please try your request again later.', senderNumber);
                        	}
                        	else {
                        		// Create locations array.
                            	var locations = [];
                            	res.forEach(function (row) {
                               		distance = calculateDistant(latitude, longitude, row.geometry.coordinates[1], row.geometry.coordinates[0]);
                               		type = new locationType();
                               		type.nameAddress(requestType, row);
                               		location = {name: type.name, address: type.address, distance: distance};
                            		locations.push(location);
                            	});
                            	
                            	// If no locations found within bounding box.
                            	if(locations.length == 0) {
                            		sendMessage('Sorry, no locations found for that address.', senderNumber);  
                            	}
                            	else {
                            		// Sort locations array based on distance.
                                	locations.sort(sortOnDistance);
                                	                         	
                                	// Prepare SMS message with location details.
                                	for(var i=0; i<config.general.throttle; i++) {
                                		var message = 'Name: ' + locations[i].name;
                                		message += ' Address: ' + locations[i].address;
                                		message += ' Distance: ' + locations[i].distance + ' miles.';
                                		sendMessage(message, senderNumber);                            		
                                	}                            		
                            	}                            	                          	
                        	}
                        });
                    }
                    
                    // If the address can't be geocoded.
                    else {
                    	sys.puts('Could not geocode address: ' + address);
                    	sendMessage('Sorry, an error occured. Please try your request again later.', senderNumber);
                    }
                    
                });  
            	
        	}
        	
        	// If an exception occurs.
        	catch(ex) {        		
        		sys.puts('An exception occured. ' + ex.message);
        		sendMessage('Sorry, an error occured. Please try your request again later.', senderNumber);
        	}        	
        });

        res.writeHead(200);
        res.end();

}).listen(config.general.port);
sys.puts('Server listening on port ' + config.general.port);
