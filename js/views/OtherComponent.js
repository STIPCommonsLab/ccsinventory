CCSI.Views.OtherComponent = Backbone.View.extend({
    template: _.template($('#other-checkbox-tmpl').html()),

    render: function(){
        var app = this;
        app.$el.append(app.template(app.data));
        return this;
    },
});
