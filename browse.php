<?php
	require('php/includes/header.php');
	require('php/includes/browse-form.php');
	require('php/includes/footer.php');
?>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/vendor/bootstrap.min.js"></script>
    <!-- Include jQuery Text Change Event plugin-->
    <script src="js/vendor/jquery.textchange.min.js"></script>
    <script src="http://libs.cartocdn.com/cartodb.js/v3/cartodb.js"></script>

       <script>
    	var cdbAccount = 'inventory';
		var tableName = 'icarto_inventory';
		var qBase = "select * from " + tableName;
		var qParams;
		var lastFeature;
        var booleans = [ 'age_public', 'age_families', 'age_elementary', 'age_middle', 'age_teens', 'age_seniors',
        'outcomes_research', 'outcomes_operational', 'outcomes_regulation', 'outcomes_education', 'outcomes_community',
        'outcomes_policy', 'outcomes_proofconcept', 'outcomes_other', 'audience_teachers', 'audience_museum',
        'audience_administration', 'audience_scientists', 'audience_evaluators', 'audience_public',
        'sponsors_blm', 'sponsors_dhs', 'sponsors_doi', 'sponsors_epa', 'sponsors_hhs', 'sponsors_nara',
        'sponsors_nasa', 'sponsors_nih', 'sponsors_noaa', 'sponsors_nsf', 'sponsors_nps', 'sponsors_ssa',
        'sponsors_usstate', 'sponsors_usagriculture', 'sponsors_usaid', 'sponsors_usgs', 'sponsors_legislative',
        'sponsors_executive', 'sponsors_judicial', 'sponsors_independent', 'sponsors_usfs'];
		var contactInfo = ['project_contact', 'affiliation', 'email', 'phone', 'street_address', 'street_address_2', 'city', 'state', 'zip'];


		// create new where parameters variable

    	$( document ).ready(function() {
			initMap();
			$("[data-toggle='tooltip']").tooltip();

            $("#searchinput").keyup(function(){
                $("#searchclear").toggle(Boolean($(this).val()));
            });

            $("#searchclear").toggle(Boolean($("#searchinput").val()));
		});

		function initMap() {

			cartodb.createVis('browse-map', 'http://inventory.cartodb.com/api/v2/viz/5f803e6a-c693-11e4-9078-0e853d047bba/viz.json', {
				tiles_loader: true,
				center_lat: 36,
				center_lon: -97,
				zoom: 3
			})
			.done(function(vis, layers) {
				// layer 0 is the base layer, layer 1 is cartodb layer
				var points = layers[1].getSubLayer(0);
                var cluster = layers[1].getSubLayer(1);
				createSelector(points, cluster);
				points.on('featureClick', function(e, latlng, pos, data, subLayerIndex) {
					console.log("clicked: " + data.cartodb_id);
					lastFeature = data.cartodb_id;
				});
			})
			.error(function(err) {
				console.log(err);
			});

	     }

	     function createSelector(points, cluster) {
	        var sql = new cartodb.SQL({ user: cdbAccount });

	        var $options = $(':checkbox');
	        $options.change(function(e) {
                    filterPoints(points);
                    filterCluster(cluster);
	        });

            $("#filter-btn").click(function() {
                    filterPoints(points);
                    filterCluster(cluster);
            });

            $('#searchinput').bind("keypress", function (e) {
                if (e.keyCode == 13) {
                    filterPoints(points);
                    filterCluster(cluster);
                }
            });

            $("#searchclear").click(function(){
                    $("#searchinput").val('').focus();
                    $(this).hide();
                    filterPoints(points);
                    filterCluster(cluster);
            });

            $('#searchinput').bind('notext', function () {
                filterPoints(points);
                filterCluster(cluster);
            });

	      }

          function filterPoints(layer){
	          qParams = '';
              getSearchinput();
              getCheckboxes();
              qParams = " WHERE " + qParams;
	          layer.setSQL(qBase + qParams);
	          //console.log(qBase + qParams);
          }

          function filterCluster(layer){
	          qParams = '';
              getSearchinput();
              getCheckboxes();
              qParams = " WHERE " + qParams;
              layer.setSQL("WITH meta AS (    SELECT greatest(!pixel_width!,!pixel_height!) as psz,ext, ST_XMin(ext) xmin, ST_YMin(ext) ymin FROM (SELECT !bbox! as ext) a),  filtered_table AS (    SELECT t.* FROM (SELECT * FROM icarto_inventory " + qParams + ") t, meta m WHERE t.the_geom_webmercator && m.ext  ), bucketA_snap AS (SELECT ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * 48, m.psz * 48) the_geom_webmercator, count(*) as points_count, 1 as cartodb_id, array_agg(f.cartodb_id) AS id_list  FROM filtered_table f, meta m  GROUP BY ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * 48, m.psz * 48), m.xmin, m.ymin), bucketA  AS (SELECT * FROM bucketA_snap WHERE points_count >  48 * 1 ) , bucketB_snap AS (SELECT ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * 0.75 * 48, m.psz * 0.75 * 48) the_geom_webmercator, count(*) as points_count, 1 as cartodb_id, array_agg(f.cartodb_id) AS id_list  FROM filtered_table f, meta m  WHERE cartodb_id NOT IN (select unnest(id_list) FROM bucketA)  GROUP BY ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * 0.75 * 48, m.psz * 0.75 * 48), m.xmin, m.ymin), bucketB  AS (SELECT * FROM bucketB_snap WHERE points_count >  48 * 0.75 ) , bucketC_snap AS (SELECT ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * 0.5 * 48, m.psz * 0.5 * 48) the_geom_webmercator, count(*) as points_count, 1 as cartodb_id, array_agg(f.cartodb_id) AS id_list  FROM filtered_table f, meta m  WHERE cartodb_id NOT IN (select unnest(id_list) FROM bucketA)  AND cartodb_id NOT IN (select unnest(id_list) FROM bucketB)  GROUP BY ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * 0.5 * 48, m.psz * 0.5 * 48), m.xmin, m.ymin), bucketC  AS (SELECT * FROM bucketC_snap WHERE points_count >  GREATEST(48 * 0.1, 2)  )  SELECT the_geom_webmercator, 1 points_count, cartodb_id, ARRAY[cartodb_id] as id_list, 'origin' as src, cartodb_id::text cdb_list FROM filtered_table WHERE cartodb_id NOT IN (select unnest(id_list) FROM bucketA) AND cartodb_id NOT IN (select unnest(id_list) FROM bucketB) AND cartodb_id NOT IN (select unnest(id_list) FROM bucketC)  UNION ALL SELECT *, 'bucketA' as src, array_to_string(id_list, ',') cdb_list FROM bucketA UNION ALL SELECT *, 'bucketB' as src, array_to_string(id_list, ',') cdb_list FROM bucketB UNION ALL SELECT *, 'bucketC' as src, array_to_string(id_list, ',') cdb_list FROM bucketC");
	          //console.log('filter cluster');
          }

	      function getCheckboxes() {
			  var groups = 0;
			  $('.panel').each(function() {
				  var divId = this.id;
				  var paramNum = 0;
				  var groupInc = false;
			      $('#' + divId + ' :checkbox:checked').each(function() {
					  if (groups == 0 && paramNum == 0) {
						  qParams += ' AND (';
					  }
					  else if (groups > 0 && paramNum == 0) {
						  qParams += ' AND ';
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

          function getSearchinput() {
            qParams += '(LOWER(project_name) LIKE ' + "LOWER('%" + $('#searchinput').val() + "%') ";
            qParams += 'OR LOWER(project_description) LIKE ' + "LOWER('%" + $('#searchinput').val() + "%') ";
            qParams += 'OR LOWER(keywords) LIKE ' + "LOWER('%" + $('#searchinput').val() + "%')";
            qParams += ')';
          }

	      function showModal() {
		      console.log(lastFeature);
			  $.ajax({
					type: "GET",
					dataType: "jsonp",
					contentType: "application/json",
					url: 'http://inventory.cartodb.com/api/v2/sql?q=SELECT * FROM icarto_inventory WHERE cartodb_id=' + lastFeature,
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
									$('#m-' + key).css('display', 'inline-block');
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
