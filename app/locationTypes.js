/* A helper object that parses location JSON in a 
 *  CouchDB instance into a format suitable for an
 *  SMS message.
 */

locationType = function() {
	this.name;
	this.address;
};

locationType.prototype.nameAddress = function(type, location) {
	
	switch(type) {
	
	case 'phl_libraries':
		this.name = location.properties.BRANCH_NAM;
		this.address = location.properties.ADDRESS;
		break;
		
	case 'phl_schools':
		this.name = location.properties.LOCNAME;
		this.address = location.properties.LOCADDRESS;
		break;
		
	case 'phl_fire_stations':
		this.name = 'Philadelphia Fire Station';
		this.address = location.properties.LOCATION;
		break;
		
	case 'phl_police_station':
		break;
		
	case 'phl_polling_place':
		break;
		
	case 'phl_farmers_market':
		break;
		
	}
	
	// Additional locations can be added depnding on availability.
	
};

exports.locationType = locationType;