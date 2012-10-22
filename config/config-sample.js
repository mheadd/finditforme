Config = function() {

	// General
	this.listen_port = 3000;
	
	// Google
	this.google_api_key = '';
	
	// SMSified
	this.smsified_user = '';
	this.smsified_password = '';
	this.smsified_sender_address = '';

	// CouchDB
	this.couchdb_host = '';
	this.couchdb_port = '';
	this.couchdb_user = '';
	this.couchdb_password = '';
	this.couchdb_name = '';

};

Config.prototype.getType = function(message) {
	if(message.search('#') == -1) {
		throw new RequestFormatException("No # in message body.");
	}
	return message.substring((message.indexOf('#')+1), message.length);
};

Config.prototype.getAddress = function(message) {
	if(message.search('#') == -1) {
		throw new RequestFormatException("No # in message body.");
	}
	return message.substring(0, message.indexOf('#'));	
};

Config.prototype.formatResponse = function(type, place) {
	// TODO: Add distance from current location?
	return 'Closest ' + type + ' location: ' + place.name.replace('&', 'and') + '. ' + place.vicinity.replace('&', 'and') + '.';
};

exports.Config = Config;