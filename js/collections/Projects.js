CCSI.Collections.Projects = Backbone.Collection.extend({
    model: CCSI.Models.Project,

    url: function() {
        // The regexp replacement was added because of some encoding problem with %, so we have to "encode" them manually
        return 'https://' + cdb_account + '.cartodb.com/api/v2/sql?q=SELECT ' + project_fields.join() + ' FROM ' + cdb_projects_table + (qParams ? ' WHERE ' + qParams.replace(new RegExp('[%]', 'g'), '%25') : '');
    },

    comparator: function(item) {
        return item.get('project_name');
    },

    parse: function(data){
        rows = data.rows;
        for (var i = 0, len = rows.length; i < len; i++) {
            rows[i].geojson = JSON.parse(rows[i].geojson);
            if (rows[i].geojson) {
                rows[i].geojson.coordinates.reverse();
            }
        }
        return rows;
    }
});
