CCSI.Views.OtherFilterComponent = Backbone.View.extend({
    template: _.template($('#filter-checkbox-other-tmpl').html()),

    render: function(){
        var app = this;
        app.$el.append(app.template(app.data));
        return this;
    },
});
