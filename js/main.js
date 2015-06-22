var qBase = "select * from " + cdb_projects_table;
var qParams = '';

var project_fields = [
  'cartodb_id',
  'project_name',
  'project_url',
  'project_description',
  'keywords',
  'status',
  'start_date',
  'geographic_scope',
  'participation_type',
  'project_contact',
  'affiliation',
  'street_address',
  'street_address_2',
  'city',
  'state',
  'zip',
  'email',
  'phone',
  'st_asgeojson(the_geom) as geojson'
];

var projects_list_view = new CcsInventory.Views.ProjectsListView({
    el: $('#project_list')
});

new CcsInventory.Collections.Metadata();

var router = new CcsInventory.Routers.Project();

var project_data = new CcsInventory.Views.ProjectPanel({
  collection: projects_list_view.collection,
  el: $('#project_data')
});

function select_project(projectId) {
  if (typeof project_data.collection.get(projectId) !== 'undefined') {
    show_project_panel(projectId);
    if (!project_panel_visible()) {
      // If we weren't viewing projects, we store the current view
      store_map_state();
    }
    zoom_to_project(projectId);
  }
}

function project_panel_visible() {
  return $('#project_panel').css('left') == '0px';
}

function show_project_panel(projectId) {
  project_data.render(projectId);
  $('#project_panel').animate({left: '0'});
}

function zoom_to_project(projectId) {
  map.setZoom(8);
  map.panTo(project_data.collection.get(projectId).get('geojson').coordinates);
}

function close_project_panel() {
  $('#project_panel').animate({left: '-100%'});
  // Remove the fragment id from the URL
  router.navigate();
  // Reset the map to our previous view
  reset_view();
}

function reset_view() {
  map.setZoom(previous_zoom);
  map.panTo(previous_center);
}

function store_map_state() {
  previous_zoom = map.getZoom();
  center = map.getCenter();
  previous_center = [center.lat, center.lng];
}

function applyQuery() {
  filterMap();
  filterList();
}

function filterMap() {
  fillWhere(); // set global var qParams
  var points = layer.getSubLayer(0);
  // TODO activate clusters
  //var cluster = layer.getSubLayer(0);
  points.setSQL(qBase + " WHERE " + qParams);
  // TODO activate clusters
  //cluster && filterCluster(cluster, " WHERE " + qParams);
}

function filterList() {
  projects_list_view.collection.fetch();
}

function fillWhere() {
  qParams = '';
  getSearchinput();
  getCheckboxes();
}

function getCheckboxes() {
  var groups = 0;
  $('#filters .panel-body').each(function() {
    var divId = this.id;
    var paramNum = 0;
    var groupInc = false;
      $('#' + divId + ' :checkbox:checked').each(function() {
      if (groups == 0 && paramNum == 0) {
        qParams += ' AND (';
      }
      else if (groups > 0 && paramNum == 0) {
        qParams += ' AND (';
      }
        if (paramNum > 0) qParams += ' OR ';
        qParams += 'lower(' + divId + ') LIKE ' + "'%" + this.name.toLowerCase() + "%'";
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

function filterCluster(layer, where){
  layer.setSQL("WITH meta AS (    SELECT greatest(!pixel_width!,!pixel_height!) as psz,ext, ST_XMin(ext) xmin, ST_YMin(ext) ymin FROM (SELECT !bbox! as ext) a),  filtered_table AS (    SELECT t.* FROM (SELECT * FROM " + cdb_projects_table +  " " + where + ") t, meta m WHERE t.the_geom_webmercator && m.ext  ), bucketA_snap AS (SELECT ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * 48, m.psz * 48) the_geom_webmercator, count(*) as points_count, 1 as cartodb_id, array_agg(f.cartodb_id) AS id_list  FROM filtered_table f, meta m  GROUP BY ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * 48, m.psz * 48), m.xmin, m.ymin), bucketA  AS (SELECT * FROM bucketA_snap WHERE points_count >  48 * 1 ) , bucketB_snap AS (SELECT ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * 0.75 * 48, m.psz * 0.75 * 48) the_geom_webmercator, count(*) as points_count, 1 as cartodb_id, array_agg(f.cartodb_id) AS id_list  FROM filtered_table f, meta m  WHERE cartodb_id NOT IN (select unnest(id_list) FROM bucketA)  GROUP BY ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * 0.75 * 48, m.psz * 0.75 * 48), m.xmin, m.ymin), bucketB  AS (SELECT * FROM bucketB_snap WHERE points_count >  48 * 0.75 ) , bucketC_snap AS (SELECT ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * 0.5 * 48, m.psz * 0.5 * 48) the_geom_webmercator, count(*) as points_count, 1 as cartodb_id, array_agg(f.cartodb_id) AS id_list  FROM filtered_table f, meta m  WHERE cartodb_id NOT IN (select unnest(id_list) FROM bucketA)  AND cartodb_id NOT IN (select unnest(id_list) FROM bucketB)  GROUP BY ST_SnapToGrid(f.the_geom_webmercator, 0, 0, m.psz * 0.5 * 48, m.psz * 0.5 * 48), m.xmin, m.ymin), bucketC  AS (SELECT * FROM bucketC_snap WHERE points_count >  GREATEST(48 * 0.1, 2)  )  SELECT the_geom_webmercator, 1 points_count, cartodb_id, ARRAY[cartodb_id] as id_list, 'origin' as src, cartodb_id::text cdb_list FROM filtered_table WHERE cartodb_id NOT IN (select unnest(id_list) FROM bucketA) AND cartodb_id NOT IN (select unnest(id_list) FROM bucketB) AND cartodb_id NOT IN (select unnest(id_list) FROM bucketC)  UNION ALL SELECT *, 'bucketA' as src, array_to_string(id_list, ',') cdb_list FROM bucketA UNION ALL SELECT *, 'bucketB' as src, array_to_string(id_list, ',') cdb_list FROM bucketB UNION ALL SELECT *, 'bucketC' as src, array_to_string(id_list, ',') cdb_list FROM bucketC");
}
