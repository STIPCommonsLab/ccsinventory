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
  if (typeof projectsList.get(projectId) !== 'undefined') {
    window.location.hash = '#' + projectId;
    show_project_panel(projectId);
    zoom_to_project(projectId);
  }
}

function show_project_panel(projectId) {
  project_data.render(projectId);
  $('#project_panel').animate({left: '0'});
}

function zoom_to_project(projectId) {
  map.setZoom(8);
  map.panTo(projectsList.get(projectId).get('geojson').coordinates);
}

projectsList.fetch({
    success: function(collection, response, options) {
      // If we have a project id in the URL fragment identifier, we display its data
      if (window.location.hash &&
        (typeof projectsList.get(window.location.hash.substr(1)) !== 'undefined')) {
        show_project_panel(window.location.hash.substr(1));
      }
    }
});

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
