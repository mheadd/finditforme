/*
 * Config settings.
 */

var couchdb = {
		
		// Details of the CouchDB instance housing location data (PHLAPI or similar GeoCouch Instance)
		geohost: 'http://phlapi.com',
		geoport: 5984,
		geopath : '/_design/geojson/_spatial/points',
		geoprefix : 'phl_',
	
		// Details of the CouchDB instance where message delivery records are stored. 
		loghost: '',
		logport: 5984,
		logname: '',	
		logpath : '/',
		logprefix : '',
		loguser: '',
		logpass: ''	
		
};

// SMSified credentials and settings.
var smsified = {
		username : '',
		password : '',
		senderAddress : ''
};

// Misc settings.
var general = {
	
		// Port that HTTP server listens on. 
		port: 8000,
		
		// Controls size of bounding box or location searches.
		distanceFactor : 0.015,
		
		// Controls the number of locations returned to user.
		throttle : 1 
};

exports.couchdb = couchdb;
exports.smsified = smsified;
exports.general = general;