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
    var arr = this.$el.serializeArray();
    var data = _(arr).reduce(function(acc, field) {
      acc[field.name] = field.value;
      return acc;
    }, {});
    this.model.save(data);
    return false;
  }
});
 
var project_form = new ProjectForm({el: this.$('form'), model: new Project()});
