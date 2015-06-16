// MODELS

Project = Backbone.Model.extend({
    defaults:{
        cartodb_id: null,
        project_name: null,
    }
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
    url: 'http://' + cdb_account + '.cartodb.com/api/v2/sql?q=SELECT cartodb_id, project_name FROM ' + cdb_projects_table,

    comparator: function(item) {
        return item.get('project_name');
    },

    parse: function(data){
        return data.rows;
    },

});

FilterElementList = Backbone.Collection.extend({
    model: FilterElement,
    url: '',

    comparator: function(item) {
        return item.get('property_name');
    }

});

Metadata = Backbone.Collection.extend({
    model: FilterElement,

    url: 'http://' + cdb_account + '.cartodb.com/api/v2/sql?q=SELECT property_category, property_code, property_name FROM ' + cdb_metadata_table,

    parse: function(data){
        return data.rows;
    },

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

FilterPanel = Backbone.View.extend({

    template: _.template($('#filter-checkbox-tmpl').html()),

    render: function(){
        var app = this;
        this.collection.models.forEach(function(element){
            app.$el.append(app.template(element.toJSON()));
        })
        return this;
    },

});

var projectsList = new ProjectCollection();

var projectsView = new ProjectListView({
    el: $('#project_list'),
    collection: projectsList
});

var metadata = new Metadata();

var project_topic = new FilterPanel({
    el: $('#project_topic'),
});

var project_status = new FilterPanel({
    el: $('#project_status'),
});

projectsList.fetch();

metadata.fetch({
    success: function(collection, response, options){
        project_topic.collection = new FilterElementList(
            metadata.where({property_category: 'project_topic'})
        );
        project_topic.render();

        project_status.collection = new FilterElementList(
            metadata.where({property_category: 'project_status'})
        );
        project_status.render();

        console.log('succes');
    },
    error: function(collection, xhr, options){
        console.log('error');
    }
});
