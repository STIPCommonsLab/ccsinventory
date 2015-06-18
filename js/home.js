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

var projectsList = new ProjectCollection();

var projectsView = new ProjectListView({
  el: $('#project_list'),
  collection: projectsList
});

projectsList.fetch();

var metadata = new Metadata();

metadata.fetch({
    success: function(collection, response, options){

        metadata.models.forEach(function(element){
            var filter_panel = new FilterPanel({
                el: $('#' + element.get('property_category')),
            });
            filter_panel.model = element;
            filter_panel.render();
        })

        console.log('succes');
    },
    error: function(collection, xhr, options){
        console.log('error');
    }
});
