FilterElement = Backbone.Model.extend({
    defaults:{
        property_category: null,
        property_code: null,
        property_name: null
    }
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

var metadata = new Metadata();

var project_topic = new FilterPanel({
    el: $('#project_topic'),
});

var project_status = new FilterPanel({
    el: $('#project_status'),
});

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
