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

FilterPanel = Backbone.View.extend({

    template: _.template($('#filter-checkbox-tmpl').html()),

    render: function(){
        var app = this;
        app.$el.append(app.template(app.model.toJSON()));
        return this;
    },

});
