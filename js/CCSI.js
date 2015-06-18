project_fields = [
  'cartodb_id',
  'project_name',
  'project_url',
  'project_description',
  'keywords',
  'st_asgeojson(the_geom) as geojson'
];

// MODELS

Project = Backbone.Model.extend({
    defaults:{
        cartodb_id: null,
        project_name: null
    },
    idAttribute: 'cartodb_id'
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
    url: 'http://' + cdb_account + '.cartodb.com/api/v2/sql?q=SELECT ' + project_fields.join() + ' FROM ' + cdb_projects_table + ' WHERE project_name IS NOT NULL',

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

var ProjectListView = Backbone.View.extend({

  template: _.template($('#project-list-tmpl').html()),

  initialize: function() {
    this.listenTo(this.collection, 'sync', this.render);
  },

  render: function(){
        var app = this;
        this.collection.models.forEach(function(element){
            app.$el.append(app.template(element.toJSON()));
        })

        $('.project-num').text(this.collection.length);
        return this;
  }

});

var FilterPanel = Backbone.View.extend({

    template: _.template($('#filter-checkbox-tmpl').html()),

    render: function(){
        var app = this;
        app.$el.append(app.template(app.model.toJSON()));
        return this;
    },

});

var ProjectPanel = Backbone.View.extend({

    template: _.template($('#project-data-tmpl').html()),

    render: function(projectId){
        this.$el.html(this.template(projectsList.get(projectId).toJSON()));
        return this;
    },

});

var projectsList = new ProjectCollection();

var projectsView = new ProjectListView({
    el: $('#project_list'),
    collection: projectsList
});

var metadata = new Metadata();

var project_data = new ProjectPanel({
  el: $('#project_data')
});

function select_project(projectId) {
  show_project_panel(projectId);
  zoom_to_project(projectId);
}

function show_project_panel(projectId) {
  project_data.render(projectId);
  $('#project_panel').animate({left: '0'});
}

function zoom_to_project(projectId) {
  map.setZoom(8);
  map.panTo(projectsList.get(projectId).get('geojson').coordinates);
}

projectsList.fetch();

metadata.fetch({
    success: function(collection, response, options){

        metadata.models.forEach(function(element){
            var filter_panel = new FilterPanel({
                el: $('#' + element.get('property_category')),
            });
            filter_panel.model = element;
            filter_panel.render();
        })

        console.log('success');
    },
    error: function(collection, xhr, options){
        console.log('error');
    }
});
