CcsInventory.Models.Project = Backbone.Model.extend({
    defaults:{
        cartodb_id: null,
        project_name: null
    },
    idAttribute: 'cartodb_id',

    urlRoot: 'http://198.211.119.82/ccsinventory/api/index.php/project'    

});
