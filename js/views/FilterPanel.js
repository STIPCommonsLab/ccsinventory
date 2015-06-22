CcsInventory.Views.FilterPanel = Backbone.View.extend({
    template: _.template($('#filter-checkbox-tmpl').html()),

    render: function(){
        var app = this;
        app.$el.append(app.template(app.model.toJSON()));
        return this;
    },
});
