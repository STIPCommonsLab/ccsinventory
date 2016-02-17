var properties = new CCSI.Collections.Properties();

properties.fetch({
    success: function(collection, response, options){

        properties.models.forEach(function(element){
            var property_panel = new CCSI.Views.PropertyComponent({
                el: $('#' + element.get('property_category')),
            });

            if (element.get('property_category') == "agency_sponsor") {
                    property_panel.template = _.template($('#multiple-select-tmpl').html());

            }else{

                if ($('#' + element.get('property_category')).is('select')) {
                    property_panel.template = _.template($('#filter-select-tmpl').html());
                }
            }

            property_panel.model = element;
            property_panel.render();

        })
    },
    error: function(collection, xhr, options){
        console.log('error on fetching properties');
    },
    complete: function(collection, xhr, options){
        var options = { hideSidePanel: true, startCollapsed: true };
        $("#agency_sponsor").treeMultiselect(options);
    }
});

var project_form = new CCSI.Views.ProjectForm({
    el: this.$('form'),
    model: new CCSI.Models.Project()
});
