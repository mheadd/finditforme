commonFuncs = function() {};
commonFuncs.prototype.getType = function(message) {
	if(message.search('#') == -1) {
		throw new RequestFormatException("No # in message body.");
	}
	return message.substring((message.indexOf('#')+1), message.length);
};

commonFuncs.prototype.getAddress = function(message) {
	if(message.search('#') == -1) {
		throw new RequestFormatException("No # in message body.");
	}
	return message.substring(0, message.indexOf('#'));	
};

commonFuncs.prototype.formatResponse = function(place) {
	return place.name + '. ' + place.vicinity + '.';
};
exports.utilities = commonFuncs;