CcsInventory.Routers.Project = Backbone.Router.extend({
    routes: {
      'projectId/:id': 'selectProject'
    },

    initialize: function() {
    },

    selectProject: function(id) {
      select_project(id);
    }
  });
