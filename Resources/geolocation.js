	
var getLocation = function() { 	

	Titanium.Geolocation.getCurrentPosition( function(e) {
		if (!e.success) {
			geoLocationResult.status = false;
			alert('Could not retrieve location');
			return;
		}
		geoLocationResult.status  = true;
		var longitude = e.coords.longitude;
		var latitude = e.coords.latitude;
		geoLocationResult.longitude = longitude;
		geoLocationResult.latitude = latitude;

		// try to get address
		Titanium.Geolocation.reverseGeocoder(latitude,longitude, function(evt) {
			var street = '';
			var city = '';
			var country = '';
			if (evt.success) {
				var places = evt.places;
				if (places && places.length) {
					street = places[0].street;
					city = places[0].city;
					country = places[0].country_code;
					geoLocationResult.astatus = true;
				} else {
					geoLocationResult.astatus = false;
					address = "No address found";
				}
				geoLocationResult.street = street;
				geoLocationResult.city = city;
				geoLocationResult.country = country;
			}
		});
	});
	return geoLocationResult;
}