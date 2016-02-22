var properties = new CCSI.Collections.Properties();

properties.fetch({
    success: function(collection, response, options){

        properties.models.forEach(function(element){
            var property_panel = new CCSI.Views.PropertyComponent({
                el: $('#' + element.get('property_category')),
            });

            if (element.get('property_category') == "agency_sponsor") {
                    property_panel.template = _.template($('#multiple-select-tmpl').html());

                    // Rendering government contact affiliation
                    var property_panel_government = new CCSI.Views.PropertyComponent({
                        el: $('#government_contact_affiliation'),
                    });

                    property_panel_government.template = _.template($('#multiple-select-tmpl').html());
                    property_panel_government.model = element;
                    property_panel_government.render();


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
        var options = { hideSidePanel: true, startCollapsed: true, allowBatchSelection: false };
        $("#agency_sponsor").treeMultiselect(options);
        $("#government_contact_affiliation").treeMultiselect(options);

        // Project topic other checkbox render
        var property_panel = new CCSI.Views.OtherComponent({
                el: $('#project_topic'),
            });
        property_panel.data = { identifier: 'project_topic'}
        property_panel.render();

        // Participant age other checkbox render
        var property_panel = new CCSI.Views.OtherComponent({
                el: $('#participant_age'),
            });
        property_panel.data = { identifier: 'participant_age'}
        property_panel.render();

        // Participant age other checkbox render
        var property_panel = new CCSI.Views.OtherComponent({
                el: $('#agency_partner'),
            });
        property_panel.data = { identifier: 'agency_partner'}
        property_panel.render();

        // Project status other checkbox render
        var property_panel = new CCSI.Views.OtherComponent({
                el: $('#project_status'),
            });
        property_panel.template = _.template($('#other-select-tmpl').html());
        property_panel.data = { identifier: 'project_status'}
        property_panel.render();

        // Project status other checkbox render
        var property_panel = new CCSI.Views.OtherComponent({
                el: $('#project_status'),
            });
        property_panel.template = _.template($('#script-select-tmpl').html());
        property_panel.data = { identifier: 'project_status'}
        property_panel.render();


        // Project topic other checkbox render
        var property_panel = new CCSI.Views.OtherComponent({
                el: $('#intended_outcomes'),
            });
        property_panel.data = { identifier: 'intended_outcomes'}
        property_panel.render();

        // Project topic other checkbox render
        var property_panel = new CCSI.Views.OtherComponent({
                el: $('#participation_tasks'),
            });
        property_panel.data = { identifier: 'participation_tasks'}
        property_panel.render();

    }
});

var project_form = new CCSI.Views.ProjectForm({
    el: this.$('form'),
    model: new CCSI.Models.Project()
});
