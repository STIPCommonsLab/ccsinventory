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
var qBase = "select * from " + cdb_projects_table;
var qParams = '';

// ROUTER

Router = Backbone.Router.extend({
    routes: {
      'projectId/:id': 'selectProject'
    },

    initialize: function() {
    },

    selectProject: function(id) {
      select_project(id);
    }
  });

// MODELS

Project = Backbone.Model.extend({
    defaults:{
        cartodb_id: null,
        project_name: null
    },
    idAttribute: 'cartodb_id'

    url: 'http://198.211.119.82/ccsinventory/api/index.php/project';
});

FilterElement = Backbone.Model.extend({
    defaults:{
        property_category: null,
        property_code: null,
        property_name: null
    }
});

// COLLECTIONS

ProjectCollection = Backbone.Collection.extend({
    model: Project,

    url: function() {
      // The regexp replacement was added because of some encoding problem with %, so we have to "encode" them manually
      return 'http://' + cdb_account + '.cartodb.com/api/v2/sql?q=SELECT ' + project_fields.join() + ' FROM ' + cdb_projects_table + (qParams ? ' WHERE ' + qParams.replace(new RegExp('[%]', 'g'), '%25') : '');
    },

    comparator: function(item) {
        return item.get('project_name');
    },

    parse: function(data){
      rows = data.rows;
      for (var i = 0, len = rows.length; i < len; i++) {
        rows[i].geojson = JSON.parse(rows[i].geojson);
        if (rows[i].geojson) {
          rows[i].geojson.coordinates.reverse();
        }
      }
      return rows;
    },

});

FilterElementList = Backbone.Collection.extend({
    model: FilterElement,
    url: '',

});

Metadata = Backbone.Collection.extend({
    model: FilterElement,

    url: 'http://' + cdb_account + '.cartodb.com/api/v2/sql?q=SELECT property_category, property_code, property_name FROM ' + cdb_metadata_table,

    parse: function(data){
        return data.rows;
    },

    comparator: function(item) {
        return item.get('property_name');
    }

});

// VIEWS

var FilterPanel = Backbone.View.extend({

    template: _.template($('#filter-checkbox-tmpl').html()),

    render: function(){
        var app = this;
        app.$el.append(app.template(app.model.toJSON()));
        return this;
    },

});
