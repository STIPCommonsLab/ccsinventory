CcsInventory.Collections.Metadata = Backbone.Collection.extend({
    model: CcsInventory.Models.FilterElement,

    url: 'http://' + cdb_account + '.cartodb.com/api/v2/sql?q=SELECT property_category, property_code, property_name FROM ' + cdb_metadata_table,

    initialize: function() {
        var metadata = this;

        metadata.fetch({
            success: function(collection, response, options){
                metadata.models.forEach(function(element){
                    var filter_panel = new CcsInventory.Views.FilterPanel({
                        el: $('#' + element.get('property_category')),
                    });
                    filter_panel.model = element;
                    filter_panel.render();
                })

                console.log('success');
            },
            error: function(collection, xhr, options){
                console.log('error');
            }
        });
    },

    parse: function(data){
        return data.rows;
    },

    comparator: function(item) {
        return item.get('property_name');
    }

});
