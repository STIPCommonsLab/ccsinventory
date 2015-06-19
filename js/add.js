var metadata = new Metadata();

metadata.fetch({
    success: function(collection, response, options){

        metadata.models.forEach(function(element){
            var filter_panel = new FilterPanel({
                el: $('#' + element.get('property_category')),
            });

            if ($('#' + element.get('property_category')).is('select')) {
                filter_panel.template = _.template($('#filter-select-tmpl').html());
            }

            filter_panel.model = element;
            filter_panel.render();
        })

        console.log('succes');
    },
    error: function(collection, xhr, options){
        console.log('error');
    }
});

var ProjectForm = Backbone.View.extend({
  events: {'submit': 'save'},
 
  initialize: function() {
    _.bindAll(this, 'save');
  },
   
  save: function() {
    var o = {};
    var a = this.$el.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            o[this.name] += ', ' + this.value;
        } else {
            o[this.name] = this.value || '';
        }
    });

    this.model.save(JSON.stringify(o));
    return false;
  }
});
 
var project_form = new ProjectForm({el: this.$('form'), model: new Project()});
