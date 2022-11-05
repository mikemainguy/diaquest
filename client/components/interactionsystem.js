AFRAME.registerSystem('interaction-system', {
    events: {
        'registerupdate': function(evt) {
            const components = evt.target.components;

            if (components['connector']) {
                const data = components['connector'].data;
                this.connectors.set(data.startEl,  {
                    startEl: data.startEl,
                    endEl: data.endEl,
                    myEl: evt.target
                });
            }

            if (components['stuff']) {
                this.stuff.set(evt.target.id,  {});
            }

        },
        'interactionEvent': function(evt) {
            if (this.stuff.has(evt.target)) {
                if (this.sources.has(evt.target)) {


                }
            }
        }
    },
    init: function() {
        this.sources = new Map();
        this.stuff = new Map();
    }
});