CCSI.Views.ProjectForm = Backbone.View.extend({
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

        this.model.save(o, {
            success: function(model, response) {
                form_panel = $('#submit-form');
                form_panel.html(_.template($('#success-tmpl').html()));
                console.log(model);
                console.log(response);
            },
            error: function(model, response) {
                console.log(model);
                console.log(response);
            }
        });

        return false;
    }
});
