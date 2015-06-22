CcsInventory.Views.ProjectPanel = Backbone.View.extend({
    template: _.template($('#project-data-tmpl').html()),

    render: function(projectId){
        router.navigate('projectId/' + projectId);
        this.$el.html(this.template(this.collection.get(projectId).toJSON()));
        return this;
    }
});
