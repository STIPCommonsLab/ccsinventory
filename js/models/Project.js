CCSI.Models.Project = Backbone.Model.extend({
    defaults:{
        cartodb_id: null,
        project_name: null,
        agency_sponsor: null,
    },
    idAttribute: 'cartodb_id',

    urlRoot: ccsi_api_project

});
