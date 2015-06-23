CcsInventory.Views.ProjectsListView = Backbone.View.extend({
    template: _.template($('#project-list-tmpl').html()),

    initialize: function() {
        this.collection = new CcsInventory.Collections.ProjectsCollection();
        this.listenTo(this.collection, 'sync', this.render);
        this.collection.fetch({
            success: function(collection, response, options) {
                if (ready) {
                    Backbone.history.start();
                }
                ready = true;
            }
        });
    },

    render: function(){
        this.$el.html('');
        var app = this;
        this.collection.models.forEach(function(element){
            app.$el.append(app.template(element.toJSON()));
        })

        $('.project-num').text(this.collection.length);
        return this;
    }
});
