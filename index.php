<?php
	ob_start();
	require('php/includes/header.php');
	require('php/includes/main-form.php');
	require('php/includes/footer.php');

?>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/vendor/bootstrap.min.js"></script>
    <script src="js/vendor/bootstrap-datepicker.js"></script>
    <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
    <script src="js/vendor/leaflet.draw.js"></script>
    <script type="text/javascript" src="http://maps.stamen.com/js/tile.stamen.js?v1.3.0"></script>

    <script>
    	var map;
    	var drawnItems;
    	
    	$( document ).ready(function() {
			$('#date-updated').datepicker({
				format: 'yyyy-mm-dd'
			});
			$('#start-date').datepicker({
				format: 'yyyy-mm-dd'
			});
			initMap();
			$("[data-toggle='tooltip']").tooltip();

		});
		
		function initMap() {
			
			map = L.map('input-map', { scrollWheelZoom: false }).setView([36, -91], 3);
	
			var baseMap = new L.StamenTileLayer("toner-lite");
			map.addLayer(baseMap);
			
			// Initialise the FeatureGroup to store editable layers
			drawnItems = new L.FeatureGroup();
			map.addLayer(drawnItems);
			
			// Initialise the draw control and pass it the FeatureGroup of editable layers
			var drawControl = new L.Control.Draw({
				draw: {
					position: 'topleft',
					polygon: false,
					polyline: false,
					circle: false,
					rectangle: false
				},
				edit: {
					featureGroup: drawnItems
				}
			});
			map.addControl(drawControl);

			map.on('draw:created', function (e) {
				drawnItems.clearLayers();
				var type = e.layerType,
					layer = e.layer;
	
				if (type === 'marker') {
					layer.bindPopup('Project home location');
				}
	
				drawnItems.addLayer(layer);

				$("#latlng").val('ST_SetSRID(ST_Point(' + layer.getLatLng().lng + ',' + layer.getLatLng().lat + '),4326)');
			});

		}
		
		// add location button event
		$("#geocode").click(function(e){
		
			e.preventDefault();
		
			// the name form field value
			var street = $("#street-address").val();
			var city = $("#city").val();
			var state = $("#state").val();
			var zip = $("#zip").val();
		    
			if(!street || !city) {
				alert('Street address and city are required');
				return;
			}
			
			$.ajax({
				type: "GET",
				dataType: "jsonp",
				contentType: "application/json",
				url: 'http://geocoding.geo.census.gov/geocoder/locations/address?street=' + street + '&city=' + city + '&state=' + state+ '&zip=' + zip + '&benchmark=9&format=jsonp',
				success: function(data) {
					if(data.result.addressMatches[0]) {
						var gcLat = data.result.addressMatches[0].coordinates.y;
						var gcLon = data.result.addressMatches[0].coordinates.x;
						var gcLoc = new L.latLng(gcLat, gcLon);
						map.setView(gcLoc, 12);
						drawnItems.clearLayers();
						L.marker(gcLoc).addTo(drawnItems);
						$("#latlng").val('ST_SetSRID(ST_Point(' + gcLoc.lng + ',' + gcLoc.lat + '),4326)');
					}
					else alert('There was a problem geocoding that address. Please check that the address is valid.');
				},
				error: function(xhr, ajaxOptions, thrownError) {
					alert(xhr.status, thrownError);
				}
			});
			return false;
		
		  });
		
    </script>
  </body>
</html>