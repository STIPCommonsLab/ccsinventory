CCSI.Collections.Properties = Backbone.Collection.extend({
    model: CCSI.Models.Property,

    url: 'http://' + cdb_account + '.cartodb.com/api/v2/sql?q=SELECT property_category, property_code, property_name FROM ' + cdb_properties_table,

    parse: function(data){
        return data.rows;
    },

    comparator: function(item) {
        return item.get('property_name');
    }

});
