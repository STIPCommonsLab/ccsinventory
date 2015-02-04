<?php
	require('php/includes/header.php');
	require('php/includes/browse-form.php');
	require('php/includes/footer.php');
?>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/vendor/bootstrap.min.js"></script>
    <script src="http://libs.cartocdn.com/cartodb.js/v3/cartodb.js"></script>
    
       <script>
    	var cdbAccount = 'inventory';
		var tableName = 'inventory';
		var qBase = "select * from " + tableName;
		var qParams;
		var lastFeature;
		var booleans = [ 'age_public', 'age_families', 'age_elementary', 'age_middle', 'age_teens', 'age_seniors', 'outcomes_research', 'outcomes_operational', 'outcomes_regulation', 'outcomes_education', 'outcomes_community', 'outcomes_policy', 'outcomes_proofconcept', 'outcomes_other', 'audience_teachers', 'audience_museum', 'audience_administration', 'audience_scientists', 'audience_evaluators', 'audience_public'];
		var contactInfo = ['project_contact', 'affiliation', 'email', 'phone', 'street_address', 'street_address_2', 'city', 'state', 'zip'];


		// create new where parameters variable
    	
    	$( document ).ready(function() {
			initMap();
			$("[data-toggle='tooltip']").tooltip();
		});
		
		function initMap() {

			cartodb.createVis('browse-map', 'http://inventory.cartodb.com/api/v2/viz/c74af5f8-0839-11e4-812f-0e73339ffa50/viz.json', {
				tiles_loader: true,
				center_lat: 36,
				center_lon: -97,
				zoom: 3
			})
			.done(function(vis, layers) {
				// layer 0 is the base layer, layer 1 is cartodb layer
				var subLayer = layers[1].getSubLayer(0);
				createSelector(subLayer);
				subLayer.on('featureClick', function(e, latlng, pos, data, subLayerIndex) {
					console.log("clicked: " + data.cartodb_id);
					lastFeature = data.cartodb_id;
				});
			})
			.error(function(err) {
				console.log(err);
			});

	     }
	     
	     function createSelector(layer) {
	        var sql = new cartodb.SQL({ user: cdbAccount });
	
	        var $options = $(':checkbox');
	        $options.change(function(e) {
	          
	          qParams = '';
	          getCheckboxes();
	          
	          layer.setSQL(qBase + qParams);
	          
	          //console.log(qBase + qParams);
	        });
	      }
	      
	      function getCheckboxes() {
			  var groups = 0;
			  $('.panel').each(function() {
				  var divId = this.id;
				  var paramNum = 0;
				  var groupInc = false;
			      $('#' + divId + ' :checkbox:checked').each(function() {
					  if (groups == 0 && paramNum == 0) {
						  qParams += ' WHERE (';
					  }
					  else if (groups > 0 && paramNum == 0) {
						  qParams += ' AND (';
					  }
				      if (paramNum > 0) qParams += ' OR ';
				      qParams += this.name + '=' + "'" + this.value + "'";
				      paramNum++;
				      groupInc = true;
			      });
			      
			      if(groupInc) {
				      qParams += ')';
				      groups++;
			      } 
			  });
	      }
	      
	      function showModal() {
		      console.log(lastFeature);
			  $.ajax({
					type: "GET",
					dataType: "jsonp",
					contentType: "application/json",
					url: 'http://inventory.cartodb.com/api/v2/sql?q=SELECT * FROM inventory WHERE cartodb_id=' + lastFeature,
					success: function(data) {
						if(data) {
							$('span.bool-labels').hide();
							
							$('#details-modal h4').text(data.rows[0].project_name);
							
							$.each(data.rows[0], function(key, value) {
								if(key == 'project_url') {
									if(value) {
										$('#m-' + key + ' dd').html('<a href="' + value + '">' + value + '</a>');
									}
									else {
										$('#m-' + key).hide();
									}
								}
								else if( $.inArray(key, booleans)!==-1 && value == 1) {
									$('#m-' + key).show();
								}
								else if( $.inArray(key, contactInfo)!==-1) {
									if(value) {
										$('#m-' + key).text(value);
									}
									else {
										$('#m-' + key).hide();
									}
								}
								else if( $('#m-' + key).length) {
									if(value) {
										$('#m-' + key + ' dd').text(value);
									}
									else {
										$('#m-' + key).hide();
									}
								}
							});
						}
						else console.log('There was an error gettin the data');
					},
					error: function(xhr, ajaxOptions, thrownError) {
						alert(xhr.status, thrownError);
					}
				});
		      
		      $('#details-modal').modal('show');
	      }

    </script>
    
  </body>
</html>